import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../interfaces/task.interface';
import { TaskLayoutItem } from '../../../interfaces/task-layout-item.interface';



@Component({
  selector: 'g[app-task]',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({ required: true }) task!: TaskLayoutItem;
  @Input({ required: true }) rowHeight!: number;

  @Output() editTask = new EventEmitter<TaskLayoutItem>();
  @Output() deleteTask = new EventEmitter<TaskLayoutItem>();

  onEditClick() {
    this.editTask.emit(this.task);
  }

  onDeleteClick() {
    this.deleteTask.emit(this.task);
  }

  onClick(task: TaskLayoutItem) {
    // this.rightClickTask.emit({
    //   task: this.task,
    //   x: event.clientX,
    //   y: event.clientY,
    //   event: event
    // });
  }

  ngOnChanges() {
    // console.log("Task changes detected", this.task);
  }
}
