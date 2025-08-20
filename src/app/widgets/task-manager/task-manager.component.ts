import { Component, Input } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { MosService } from '../../services/mos.service';

@Component({
  selector: 'app-task-manager',
  imports: [],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

  @Input() task!: Task

  constructor(private mosService: MosService) { }

}
