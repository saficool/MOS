import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TaskLayoutItem {
  resourceId: string;
  taskId: string;
  batchId: string;
  label: string;
  x: number;
  y: number;
  w: number;
  start: Date;
  end: Date;
  backgroundColor?: string;
  textColor?: string;
}

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
}
