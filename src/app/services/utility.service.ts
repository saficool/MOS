import { Injectable } from '@angular/core';
import { Batch } from '../interfaces/batch.interface';
import { ResourceDto } from '../Dtos/Resource.dto';
import { TaskLayoutItem } from '../interfaces/task-layout-item.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  deleteTask(task: TaskLayoutItem, resources: ResourceDto[]): ResourceDto[] {
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
  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
 * Returns a hex color that is 10% darker than the input color
 * @param hexColor - Input hex color (with or without #)
 * @returns Darker hex color
 */
  darkenColor(hexColor: string, percentage: number = 10): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate darker values (reduce by percentage)
    const factor = (100 - percentage) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);

    // Convert back to hex and pad with zeros if needed
    const toHex = (value: number) => value.toString(16).padStart(2, '0');

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }
}
