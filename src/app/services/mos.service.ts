import { Injectable } from '@angular/core';
import { Resource } from '../interfaces/resource.interface';
import { Batch } from '../interfaces/batch.interface';

@Injectable({
  providedIn: 'root'
})
export class MosService {

  getMinMaxDates(resources: Resource[]): { minDate: Date, maxDate: Date } {
    const dates = resources.flatMap(m => m.tasks.flatMap(b => [b.start, b.end])).map(d => new Date(d));
    const result = {
      minDate: new Date(Math.min(...dates.map(d => d.getTime()))),
      maxDate: new Date(Math.max(...dates.map(d => d.getTime())))
    };
    return result;
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

}
