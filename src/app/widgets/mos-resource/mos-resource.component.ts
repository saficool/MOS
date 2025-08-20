import { Component, Input } from '@angular/core';
import { Resource } from '../../interfaces/resource.interface';

@Component({
  selector: 'app-mos-resource',
  imports: [],
  templateUrl: './mos-resource.component.html',
  styleUrl: './mos-resource.component.scss'
})
export class MosResourceComponent {

  @Input() resources: Resource[] = [];

  ngOnChanges() {
    // console.log('Resources changed:', this.resources);
  }

}
