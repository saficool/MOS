import { Component, Input, SimpleChanges } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { MosService } from '../../services/mos.service';
import { Resource } from '../../interfaces/resource.interface';
import { TaskManageMode } from '../../enums/task-manage-mode.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Batch } from '../../interfaces/batch.interface';
import { ResourceService } from '../../services/resource.service';

const formatDateToCustom = (dateStr: string, fixedTime: string = "04:00:00"): string => {
  const date = new Date(dateStr);

  // Get parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate() + 1).padStart(2, "0"); // if you want to move 15 → 19 adjust logic here

  return `${year}-${month}-${day}T${fixedTime}`;
};

@Component({
  selector: 'app-task-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

  @Input() manageMode: TaskManageMode = TaskManageMode.View;
  @Input() batches: Batch[] = [];
  @Input() resources: Resource[] = [];
  @Input() selectedResource!: Resource;
  @Input() selectedTask!: Task

  // Holds tasks of the selected resource in Successor section
  protected tasksOfSelectedResource: Task[] = [];


  taskManagerForm: FormGroup = new FormGroup({
    taskId: new FormControl('', [Validators.required]),
    batchId: new FormControl('', [Validators.required]),
    label: new FormControl('', [Validators.required]), // Task label
    start: new FormControl('', [Validators.required]), // Start date
    end: new FormControl('', [Validators.required]), // End date
    color: new FormControl('#7a83daff', [Validators.required]), // Default color
    successors: new FormControl('') // Array of successor task IDs
  });

  constructor(
    private mosService: MosService,
    private resourceService: ResourceService
  ) { }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.initSetupTaskForm()
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
        taskId: this.mosService.generateId(),
        batchId: '',
        label: '',
        start: '',
        end: '',
        color: '#7a83daff',
        successors: []
      });
    }
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
    this.onChangeResource(this.selectedResource?.resourceId || '');
  }

  onChangeResource(resourceId: string) {
    this.tasksOfSelectedResource = [];
    this.tasksOfSelectedResource = this.resources.find(resource => resource.resourceId === resourceId)?.tasks || [];
  }

  onSubmit() {

    // return;
    if (this.taskManagerForm.valid) {
      const taskData = this.taskManagerForm.value;

      console.log('Task Data:', taskData);

      const newTask: Task = {
        taskId: taskData.taskId || this.mosService.generateId(),
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

      // Reset form after submission
      this.taskManagerForm.reset();
    }

    this.resourceService.resources.set([]);
    this.resourceService.resources.set(this.resources);
  }
}
