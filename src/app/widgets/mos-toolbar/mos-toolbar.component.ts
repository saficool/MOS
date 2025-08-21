import { Component, effect } from '@angular/core';
import { ZoomService } from '../../services/zoom.service';
import { MosService } from '../../services/mos.service';

@Component({
  selector: 'app-mos-toolbar',
  imports: [],
  templateUrl: './mos-toolbar.component.html',
  styleUrl: './mos-toolbar.component.scss'
})
export class MosToolbarComponent {

  pxPerHour = 30; // Default value, will be updated by ZoomService

  constructor(
    private zoomService: ZoomService,
    private mosService: MosService
  ) {
    effect(() => { this.pxPerHour = this.zoomService.pxPerHour(); });
  }


  zoomIn() { this.zoomService.zoomIn(); }
  zoomOut() { this.zoomService.zoomOut(); }
  zoomReset() { this.zoomService.reset(); }

}
