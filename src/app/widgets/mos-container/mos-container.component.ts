import { Component, effect, Input, SimpleChange } from '@angular/core';
import { MosToolbarComponent } from '../mos-toolbar/mos-toolbar.component';
import { MosResourceComponent } from '../mos-resource/mos-resource.component';
import { MosCanvasComponent } from '../mos-canvas/mos-canvas.component';
import { Batch } from '../../interfaces/batch.interface';
import { Resource } from '../../interfaces/resource.interface';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-mos-container',
  imports: [MosToolbarComponent, MosResourceComponent, MosCanvasComponent],
  templateUrl: './mos-container.component.html',
  styleUrl: './mos-container.component.scss'
})
export class MosContainerComponent {
  // batches: Batch[] = [];
  // resources: Resource[] = [];

  constructor(
    // private resourceService: ResourceService
  ) {
    // effect(() => {
    //   this.batches = [...this.resourceService.batches()];
    //   this.resources = [...this.resourceService.resources()];
    // });
  }

  ngOnInit() {
  }

}
