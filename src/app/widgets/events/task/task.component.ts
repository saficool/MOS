import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
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
  @Input({ required: true }) pxPerHour!: number;

  @Output() clickTask = new EventEmitter<TaskLayoutItem>();
  @Output() rightClickTask = new EventEmitter<TaskLayoutItem>();
  @Output() editTask = new EventEmitter<TaskLayoutItem>();
  @Output() deleteTask = new EventEmitter<TaskLayoutItem>();


  onClick() {
    this.clickTask.emit(this.task);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.rightClickTask.emit(this.task);
  }

  onEdit() {
    this.editTask.emit(this.task);
  }

  onDelete() {
    this.deleteTask.emit(this.task);
  }


  ngOnChanges() {
    // console.log(this.task)
  }
}
