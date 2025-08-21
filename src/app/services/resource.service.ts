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

  // constructor() {
  //   // Initialize with empty arrays
  //   this.batches.set([]);
  //   this.resources.set([]);
  // }

  // setBatches(batches: Batch[]) {
  //   this.batches.set(batches);
  // }

  // setResources(resources: Resource[]) {
  //   this.resources.set(resources);
  // }


  // addResource(resource: Resource) {
  //   this.resources.update(res => [...res, resource]);
  // }

  // removeResource(resourceId: string) {
  //   this.resources.update(res => res.filter(r => r.resourceId !== resourceId));
  // }

  // selectResource(resource: Resource | null) {
  //   this.selectedResource.set(resource);
  // }

  // selectTask(task: Task | null) {
  //   this.selectedTask.set(task);
  // }

  // updateResource(resource: Resource) {
  //   this.resources.update(res => {
  //     const index = res.findIndex(r => r.resourceId === resource.resourceId);
  //     if (index !== -1) {
  //       res[index] = resource;
  //     }
  //     return [...res];
  //   });
  // }

  // getResourceById(resourceId: string): Resource | undefined {
  //   return this.resources().find(r => r.resourceId === resourceId);
  // }

  // getAllResources(): Resource[] {
  //   return this.resources();
  // }
  // getSelectedResource(): Resource | null {
  //   return this.selectedResource();
  // }

  // getSelectedTask(): Task | null {
  //   return this.selectedTask();
  // }
  // clearSelectedResource() {
  //   this.selectedResource.set(null);
  // }
  // clearSelectedTask() {
  //   this.selectedTask.set(null);
  // }
  // clearResources() {
  //   this.resources.set([]);
  // }
  // clearAll() {
  //   this.clearResources();
  //   this.clearSelectedResource();
  //   this.clearSelectedTask();
  // }


}
