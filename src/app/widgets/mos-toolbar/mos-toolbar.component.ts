import { Component } from '@angular/core';
import { ZoomService } from '../../services/zoom.service';
import { TaskManagerComponent } from '../task-manager/task-manager.component';

@Component({
  selector: 'app-mos-toolbar',
  imports: [TaskManagerComponent],
  templateUrl: './mos-toolbar.component.html',
  styleUrl: './mos-toolbar.component.scss'
})
export class MosToolbarComponent {

  constructor(private zoom: ZoomService) { }

  zoomIn() { this.zoom.zoomIn(); }
  zoomOut() { this.zoom.zoomOut(); }
  zoomReset() { this.zoom.reset(); }

  addTask() { }

}
