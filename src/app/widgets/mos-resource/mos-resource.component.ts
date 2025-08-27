import { Component, effect } from '@angular/core';
import { Resource } from '../../interfaces/resource.interface';
import { TaskManageMode } from '../../enums/task-manage-mode.enum';
import { MosService } from '../../services/mos.service';
import { ResourceDto } from '../../Dtos/Resource.dto';
import { BatchDto } from '../../Dtos/Batch.dto';

@Component({
  selector: 'app-mos-resource',
  imports: [],
  templateUrl: './mos-resource.component.html',
  styleUrl: './mos-resource.component.scss'
})
export class MosResourceComponent {

  protected batches: BatchDto[] = [];
  protected resources: ResourceDto[] = [];


  manageMode: TaskManageMode = TaskManageMode.Create;
  selectedResource!: Resource;

  constructor(
    private readonly mosService: MosService
  ) {
    effect(() => {
      this.batches = this.mosService.batches();
      this.resources = this.mosService.resources();

      console.log(this.resources)
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
