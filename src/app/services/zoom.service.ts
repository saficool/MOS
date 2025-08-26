import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  pxPerHour = signal(15);   // default value = 50px/hour

  zoomIn() {
    this.pxPerHour.update(val => Math.min(200, Math.round(val * 1.25)));
  }

  zoomOut() {
    this.pxPerHour.update(val => Math.max(1, Math.round(val / 1.25)));
  }

  reset() {
    this.pxPerHour.set(10); // Reset to default value
  }
}
