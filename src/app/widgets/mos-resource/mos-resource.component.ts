import { Component, effect, Input } from '@angular/core';
import { Resource } from '../../interfaces/resource.interface';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { Batch } from '../../interfaces/batch.interface';
import { TaskManageMode } from '../../enums/task-manage-mode.enum';
import { ResourceService } from '../../services/resource.service';
import { MosService } from '../../services/mos.service';
import { ResourceDto } from '../../Dtos/Resource.dto';
import { BatchDto } from '../../Dtos/Batch.dto';

@Component({
  selector: 'app-mos-resource',
  imports: [TaskManagerComponent],
  templateUrl: './mos-resource.component.html',
  styleUrl: './mos-resource.component.scss'
})
export class MosResourceComponent {

  // @Input() batches: Batch[] = [];
  // @Input() resources: Resource[] = [];

  protected batches: BatchDto[] = [];
  protected resources: ResourceDto[] = [];


  manageMode: TaskManageMode = TaskManageMode.Create;
  selectedResource!: Resource;

  constructor(
    private resourceService: ResourceService,
    private readonly mosService: MosService
  ) {
    effect(() => {
      this.batches = this.mosService.batches();
      this.resources = this.mosService.resources();
    });
  }

  ngOnChanges() {
  }

  onSelectResource(resource: ResourceDto) {
    console.log(resource);
    // this.selectedResource = resource;
  }

  onCloseModal() {

  }

}
