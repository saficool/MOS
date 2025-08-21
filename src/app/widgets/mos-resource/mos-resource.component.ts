import { Component, effect, Input } from '@angular/core';
import { Resource } from '../../interfaces/resource.interface';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { Batch } from '../../interfaces/batch.interface';
import { TaskManageMode } from '../../enums/task-manage-mode.enum';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-mos-resource',
  imports: [TaskManagerComponent],
  templateUrl: './mos-resource.component.html',
  styleUrl: './mos-resource.component.scss'
})
export class MosResourceComponent {

  @Input() batches: Batch[] = [];
  @Input() resources: Resource[] = [];


  manageMode: TaskManageMode = TaskManageMode.Create;
  selectedResource!: Resource;

  constructor(
    private resourceService: ResourceService
  ) {
  }

  ngOnChanges() {
  }

  onSelectResource(resource: Resource) {
    this.selectedResource = resource;
  }

  onCloseModal() {

  }

}
