import { Component, Input, SimpleChange } from '@angular/core';
import { MosToolbarComponent } from '../mos-toolbar/mos-toolbar.component';
import { MosResourceComponent } from '../mos-resource/mos-resource.component';
import { MosCanvasComponent } from '../mos-canvas/mos-canvas.component';
import { Batch } from '../../interfaces/batch.interface';
import { Resource } from '../../interfaces/resource.interface';

@Component({
  selector: 'app-mos-container',
  imports: [MosToolbarComponent, MosResourceComponent, MosCanvasComponent],
  templateUrl: './mos-container.component.html',
  styleUrl: './mos-container.component.scss'
})
export class MosContainerComponent {

  @Input() batches: Batch[] = [];
  @Input() resources: Resource[] = [];

  constructor() {
    // Initialization logic can go here if needed
  }

  ngOnChanges(simpleChanges: SimpleChange) {
    // Handle changes to inputs if necessary
    // console.log('Batches or resources changed:', simpleChanges);


    // console.log('Batches:', this.batches);
    // console.log('Resources:', this.resources);
  }

}
