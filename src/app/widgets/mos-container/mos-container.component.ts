import { Component } from '@angular/core';
import { MosToolbarComponent } from '../mos-toolbar/mos-toolbar.component';
import { MosResourceComponent } from '../mos-resource/mos-resource.component';
import { MosCanvasComponent } from '../mos-canvas/mos-canvas.component';

@Component({
  selector: 'app-mos-container',
  imports: [MosToolbarComponent, MosResourceComponent, MosCanvasComponent],
  templateUrl: './mos-container.component.html',
  styleUrl: './mos-container.component.scss'
})
export class MosContainerComponent {
  constructor(
  ) {
  }

  ngOnInit() {
  }

}
