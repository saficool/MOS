import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskLayoutItem } from '../../../interfaces/task-layout-item.interface';

declare var bootstrap: any;

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

  ngAfterViewInit() {
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
          html: true,
          container: 'body',
          trigger: 'hover focus'
        });
      });
    }, 100);
  }

  getTooltipContent(): string {
    return `
      <div style="text-align: left;">
        <strong>${this.task.name}</strong><br>
        <span class="badge bg-${this.getStatusColor()}">${this.task.status}</span><br>
        <small>Progress: ${this.task.progress}%</small><br>
        <small>Start: ${this.formatDate(this.task.startDate)}</small><br>
        <small>End: ${this.formatDate(this.task.endDate)}</small>
      </div>
    `;
  }

  private getStatusColor(): string {
    const colors = {
      'InProgress': 'primary',
      'Completed': 'success',
      'Planned': 'secondary',
      'Locked': 'warning',
      'Cancelled': 'danger',
      'Failed': 'danger'
    };
    return colors[this.task.status as keyof typeof colors] || 'secondary';
  }

  private formatDate(date: any): string {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }


  ngOnChanges() {
    // console.log(this.task)
  }
}
