import { Injectable, signal } from '@angular/core';
import { Resource } from '../interfaces/resource.interface';
import { Task } from '../interfaces/task.interface';
import { Batch } from '../interfaces/batch.interface';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  batches = signal<Batch[]>([]);
  resources = signal<Resource[]>([]);
  selectedResource = signal<Resource | null>(null);
  selectedTask = signal<Task | null>(null);
  showGridLineHours = signal<boolean>(true);


}
