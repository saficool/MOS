import { Component, Input, SimpleChanges } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { UtilityService } from '../../services/utility.service';
import { Resource } from '../../interfaces/resource.interface';
import { TaskManageMode } from '../../enums/task-manage-mode.enum';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Batch } from '../../interfaces/batch.interface';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, merge, Subscription } from 'rxjs';
import { MosService } from '../../services/mos.service';
import { ResourceDto } from '../../Dtos/Resource.dto';
import { TaskDto } from '../../Dtos/Task.dto';
import { TaskStatus } from '../../enums/task-status.enum';


@Component({
  selector: 'app-task-manager',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

  @Input() manageMode: TaskManageMode = TaskManageMode.View;
  @Input() batches: Batch[] = [];
  @Input() resources: ResourceDto[] = [];
  @Input() selectedResource!: Resource;
  @Input() selectedTask!: Task

  // Holds tasks of the selected resource in Successor section
  protected tasksOfSelectedResource: TaskDto[] = [];


  taskManagerForm: FormGroup = new FormGroup({
    resourceId: new FormControl('', [Validators.required]),

    taskId: new FormControl('', [Validators.required]),
    batchId: new FormControl('', [Validators.required]),
    label: new FormControl('', [Validators.required]), // Task label
    description: new FormControl('', []), // Optional description

    start: new FormControl('', [Validators.required]), // Start date
    end: new FormControl('', [Validators.required]), // End date
    duration: new FormControl('', [Validators.required]), // Duration in minutes, optional

    status: new FormControl(TaskStatus.Planned, []), // Task status, default to 'pending'
    progress: new FormControl(0, [Validators.min(0), Validators.max(100)]), // Progress in percentage e.g 0-100

    backgroundColor: new FormControl('#fff', []), // Background color for the task, which will be come from batch color
    textColor: new FormControl('#000', []), // Text color for the task label will be auto identified based on background color
    progressColor: new FormControl('#000', []), // Color for progress bar

    color: new FormControl('#000', [Validators.required]), // Default color
    successors: new FormControl('') // Array of successor task IDs
  })

  constructor(
    private utilityService: UtilityService,
    private mosService: MosService
  ) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.initSetupTaskForm()
  }
  ngOnDestroy() {
    // Clean up subscriptions
    if (this.crossFieldSubscription) {
      this.crossFieldSubscription.unsubscribe();
    }
  }

  private rangesOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return startA < endB && endA > startB;
  }

  // Enhanced overlap validator that works on the entire form
  private taskOverlapValidator(existingTasks: Task[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;

      if (!formGroup) {
        return null;
      }

      const startValue = formGroup.get('start')?.value;
      const endValue = formGroup.get('end')?.value;
      const currentTaskId = formGroup.get('taskId')?.value;

      // Skip validation if start or end date is missing
      if (!startValue || !endValue) {
        return null;
      }

      const start = new Date(startValue);
      const end = new Date(endValue);

      // Validate that end date is after start date
      if (end <= start) {
        return { invalidDateRange: { message: 'End date must be after start date' } };
      }

      // Check for overlaps with existing tasks
      const overlappingTasks = existingTasks
        .filter(task => task.taskId !== currentTaskId) // Exclude current task when editing
        .filter(task => {
          const taskStart = new Date(task.start);
          const taskEnd = new Date(task.end);
          return this.rangesOverlap(start, end, taskStart, taskEnd);
        });

      if (overlappingTasks.length > 0) {
        return {
          taskOverlap: {
            message: `Task overlaps with existing task(s): ${overlappingTasks.map(t => t.taskId).join(', ')}`,
            overlappingTasks: overlappingTasks
          }
        };
      }

      return null;
    };
  }

  // Individual field validators for better UX
  startNotOverlapping(existingTasks: Task[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const start = new Date(control.value);
      const endRaw = this.taskManagerForm.get('end')?.value;
      if (!endRaw) return null;
      const end = new Date(endRaw);

      const currentTaskId = this.taskManagerForm.get('taskId')?.value;

      for (let task of existingTasks) {
        if (task.taskId === currentTaskId) continue;
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        if (this.rangesOverlap(start, end, taskStart, taskEnd)) {
          return {
            startOverlap: {
              message: `Start time conflicts with task ${task.taskId}`,
              conflictingTask: task.taskId
            }
          };
        }
      }
      return null;
    };
  }

  endNotOverlapping(existingTasks: Task[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const end = new Date(control.value);
      const startRaw = this.taskManagerForm.get('start')?.value;
      if (!startRaw) return null;
      const start = new Date(startRaw);

      // Check if end is after start
      if (end <= start) {
        return {
          endBeforeStart: {
            message: 'End time must be after start time'
          }
        };
      }

      const currentTaskId = this.taskManagerForm.get('taskId')?.value;

      for (let task of existingTasks) {
        if (task.taskId === currentTaskId) continue;
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        if (this.rangesOverlap(start, end, taskStart, taskEnd)) {
          return {
            endOverlap: {
              message: `End time conflicts with task ${task.taskId}`,
              conflictingTask: task.taskId
            }
          };
        }
      }
      return null;
    };
  }

  private updateValidators() {

    const startControl = this.taskManagerForm.get('start');
    const endControl = this.taskManagerForm.get('end');
    const existingTasks = this.selectedResource?.tasks || [];

    if (!startControl || !endControl) return;

    startControl.setValidators([
      Validators.required
    ]);

    endControl.setValidators([
      Validators.required
    ]);

    // Apply form-level validator for comprehensive overlap checking
    this.taskManagerForm.setValidators([
      this.taskOverlapValidator(existingTasks)
    ]);

    // Update validity
    startControl.updateValueAndValidity({ emitEvent: false });
    endControl.updateValueAndValidity({ emitEvent: false });
    this.taskManagerForm.updateValueAndValidity({ emitEvent: false });

    // Setup cross-field validation with debouncing
    this.setupCrossFieldValidation();
  }

  private crossFieldSubscription?: Subscription;

  private setupCrossFieldValidation() {
    // Clean up existing subscription to prevent memory leaks
    if (this.crossFieldSubscription) {
      this.crossFieldSubscription.unsubscribe();
    }

    const startControl = this.taskManagerForm.get('start');
    const endControl = this.taskManagerForm.get('end');

    if (!startControl || !endControl) return;

    // Use merge to combine both value changes and debounce to prevent rapid updates
    this.crossFieldSubscription = merge(
      startControl.valueChanges.pipe(map(() => 'start')),
      endControl.valueChanges.pipe(map(() => 'end'))
    ).pipe(
      debounceTime(100), // Wait 100ms after user stops typing
      distinctUntilChanged()
    ).subscribe((changedField: any) => {
      // Only update form-level validation, not individual fields to avoid loops
      setTimeout(() => {
        this.taskManagerForm.updateValueAndValidity({ emitEvent: false });
      }, 0);
    });
  }

  initSetupTaskForm() {
    this.taskManagerForm.reset();
    // first chek manageMode, if it is edit mode, then set the form values
    if (this.manageMode === TaskManageMode.Edit && this.selectedTask) {
      this.taskManagerForm.patchValue({
        taskId: this.selectedTask.taskId,
        batchId: this.selectedTask.batchId,
        label: this.selectedTask.label,
        start: this.selectedTask.start, // Convert to local datetime string
        end: this.selectedTask.end, // Convert to local datetime string
        color: this.selectedTask.color,
        successors: this.selectedTask.successors || []
      });
    }
    else if (this.manageMode === TaskManageMode.Create) {
      // if it is create mode, then set the form values
      this.taskManagerForm.patchValue({
        taskId: this.utilityService.generateId(),
        batchId: '',
        label: '',
        start: '',
        end: '',
        color: '#7a83daff',
        successors: []
      });
    }

    this.updateValidators();
  }

  onSelectBatch() {
    // set color from bathc
    const selectedBatchId = this.taskManagerForm.get('batchId')?.value;
    const selectedBatch = this.batches.find(batch => batch.batchId === selectedBatchId);
    if (selectedBatch) {
      this.taskManagerForm.patchValue({ color: selectedBatch.color });
    } else {
      this.taskManagerForm.patchValue({ color: '#7a83daff' }); // Default color if no batch is selected
    }

    // Reset tasks of selected resource when batch changes
    // this.onChangeResource(this.selectedResource?.resourceId || '');
  }

  onChangeResource(resourceId: string) {
    this.tasksOfSelectedResource = [];
    this.tasksOfSelectedResource = this.resources.find(resource => resource.resourceId === resourceId)?.tasks || [];
  }

  getOverlapErrorMessage(): string {
    const formErrors = this.taskManagerForm.errors;

    if (formErrors?.['taskOverlap']) {
      return formErrors['taskOverlap'].message;
    }
    if (formErrors?.['invalidDateRange']) {
      return formErrors['invalidDateRange'].message;
    }
    return '';
  }

  hasOverlapError(): boolean {
    return !!(
      this.taskManagerForm.errors?.['taskOverlap'] ||
      this.taskManagerForm.errors?.['invalidDateRange']
    );
  }

  getFieldError(fieldName: string): string {
    const field = this.taskManagerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return `${fieldName} is required`;

    return '';
  }

  onSubmit() {
    this.taskManagerForm.markAllAsTouched();

    if (!this.taskManagerForm.valid) {
      console.log('Form has validation errors:', {
        formErrors: this.taskManagerForm.errors,
        fieldErrors: {
          start: this.taskManagerForm.get('start')?.errors,
          end: this.taskManagerForm.get('end')?.errors
        }
      });
      return;
    }

    const taskData = this.taskManagerForm.value;
    const newTask: Task = {
      taskId: taskData.taskId || this.utilityService.generateId(),
      batchId: taskData.batchId,
      label: taskData.label,
      start: taskData.start,
      end: taskData.end,
      color: taskData.color,
      successors: taskData.successors || []
    };

    // Add or update the task in the selected resource
    if (this.selectedResource) {
      const existingTaskIndex = this.selectedResource.tasks.findIndex(t => t.taskId === newTask.taskId);
      if (existingTaskIndex > -1) {
        // Update existing task
        this.selectedResource.tasks[existingTaskIndex] = newTask;
      } else {
        // Add new task
        this.selectedResource.tasks.push(newTask);
      }
    }

    // Reset form after successful submission
    this.taskManagerForm.reset();

    // Trigger resource update
    this.mosService.resources.set([]);
    this.mosService.resources.set(this.resources);
  }
}
