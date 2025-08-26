import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  pxPerHour = signal(environment.pxPerHour);   // default value = 50px/hour

  zoomIn() {
    this.pxPerHour.update(val => Math.min(200, Math.round(val * 1.25)));
  }

  zoomOut() {
    this.pxPerHour.update(val => Math.max(1, Math.round(val / 1.25)));
  }

  reset() {
    this.pxPerHour.set(environment.pxPerHour); // Reset to default value
  }
}
