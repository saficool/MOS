import { Injectable } from '@angular/core';
import { Resource } from '../interfaces/resource.interface';
import { Batch } from '../interfaces/batch.interface';
import { Task } from '../interfaces/task.interface';
import { ResourceDto } from '../Dtos/Resource.dto';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  deleteTask(task: Task, resources: ResourceDto[]): ResourceDto[] {
    // Find the resource that contains the task
    const resource = resources.find(r => r.tasks.some(t => t.taskId === task.taskId));
    if (resource) {
      // Remove the task from the resource's tasks
      resource.tasks = resource.tasks.filter(t => t.taskId !== task.taskId);
    }
    return resources; // Return the updated resources
  }

  getMinMaxDates(resources: ResourceDto[]): { minDate: Date, maxDate: Date } {
    // const dates = resources.flatMap(m => m.tasks.flatMap(b => [b.start, b.end])).map(d => new Date(d));
    // const result = {
    //   minDate: new Date(Math.min(...dates.map(d => d.getTime()))),
    //   maxDate: new Date(Math.max(...dates.map(d => d.getTime())))
    // };
    // return result;

    const dates = resources
      .flatMap(r => r.tasks.flatMap(t => [t.startDate, t.endDate]))
      .map(d => new Date(d));

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Normalize
    minDate.setHours(0, 0, 0, 0);                  // start of day
    maxDate.setHours(23, 59, 59, 999);             // end of day

    return { minDate, maxDate };
  }

  dateToX(date: Date, start: Date, pxPerHour: number): number {
    const diff = date.getTime() - start.getTime();
    return diff / (1000 * 60 * 60) * pxPerHour;
  }

  getColorForBatch(batchId: string, batches: Batch[]): string {
    if (!batchId) return '#7a83daff'; // Default color if no batchId is provided

    return batches.find(b => b.batchId === batchId)?.color || '#7a83daff'; // Default color if batch not found
  }

  getContrastColor(hex: string) {
    // remove # if present
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    // relative luminance formula
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "black" : "white";
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

}
