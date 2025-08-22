import { Component, effect, Input } from '@angular/core';
import { Resource } from '../../interfaces/resource.interface';
import { Batch } from '../../interfaces/batch.interface';
import { MosService } from '../../services/mos.service';
import { Task, TaskId } from '../../interfaces/task.interface';
import { ZoomService } from '../../services/zoom.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-mos-canvas',
  imports: [],
  templateUrl: './mos-canvas.component.html',
  styleUrl: './mos-canvas.component.scss'
})
export class MosCanvasComponent {

  @Input() batches: Batch[] = [];
  @Input() resources: Resource[] = [];

  todayX: number | null = null;
  leftGutter = 0;

  gridLineDays: { x: number; label: string; }[] = [];
  gridLineHours: { x: number; label: string; }[] = [];
  showGridLineHours: boolean = true;

  pxPerHour = 30;
  rowHeight = 48;

  totalWidth = 1000;
  totalHeight = 300;
  headerHeight = 30;
  timeWidth = 0;
  rowLayout: { resource: Resource; y: number; }[] = [];

  private startDate: Date = new Date('2023-01-01T00:00:00Z');
  private endDate: Date = new Date('2023-01-02T00:00:00Z');

  taskLayout: Array<{ resourceId: string; taskId: string; batchId: string, label: string; x: number; y: number; w: number; start: Date; end: Date; backgroundColor?: string; textColor?: string; }> = [];
  connectors: Array<{ from: string; to: string; points: string; }> = [];

  constructor(
    private mosService: MosService,
    private zoomService: ZoomService,
    private resourceService: ResourceService
  ) {
    effect(() => {
      this.pxPerHour = this.zoomService.pxPerHour();
      this.showGridLineHours = this.resourceService.showGridLineHours();
      this.recompute();
    });
  }

  ngOnChanges() {
    this.recompute();
  }

  private recompute() {
    this.computeStartEndDates();
    this.computeCanvasLayout()
    this.computeEventLayout()
  }

  private computeStartEndDates() {
    // Calculate the minimum and maximum dates from the resources
    const { minDate, maxDate } = this.mosService.getMinMaxDates(this.resources);
    this.startDate = minDate;
    this.endDate = maxDate;

    // Calculate todayX once
    const t = new Date();
    if (t < this.startDate || t > this.endDate) {
      this.todayX = null;
    } else {
      this.todayX = this.leftGutter + this.mosService.dateToX(t, this.startDate, this.pxPerHour);
    }

  }

  private computeCanvasLayout() {

    // Compute the left gutter based on the width of the resource names
    this.rowLayout = this.resources.map((m, i) => ({ resource: m, y: this.headerHeight + i * this.rowHeight }));

    this.totalHeight = this.headerHeight + this.rowLayout.length * this.rowHeight + 8;

    const hours = (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60);
    this.timeWidth = Math.max(0, hours * this.pxPerHour);
    this.totalWidth = this.leftGutter + this.timeWidth + 40;

    // Compute grid lines for each day within the date range
    this.gridLineDays = [];
    const dayMs = 24 * 3600 * 1000;
    const firstDay = new Date(this.startDate); firstDay.setHours(0, 0, 0, 0);
    for (let t = firstDay.getTime(); t <= this.endDate.getTime(); t += dayMs) {
      const x = this.leftGutter + this.mosService.dateToX(new Date(t), this.startDate, this.pxPerHour);
      this.gridLineDays.push({ x, label: new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) });
    }


    // Compute grid lines for each hour within the date range
    this.gridLineHours = [];
    const hourMs = 3600 * 1000;
    const firstHour = new Date(this.startDate); firstHour.setMinutes(0, 0, 0);
    for (let t = firstHour.getTime(); t <= this.endDate.getTime(); t += hourMs) {
      const d = new Date(t);
      const x = this.leftGutter + this.mosService.dateToX(d, this.startDate, this.pxPerHour);
      this.gridLineHours.push({ x, label: d.getHours().toString().padStart(2, '0') }); //+ ":00"
    }
  }

  // private computeEventLayout() {
  //   // const batchById = new Map<TaskId, { x: number; y: number; w: number; start: Date; end: Date; label: string; id: string; color?: string }>();
  //   const batchById = new Map<TaskId, { resourceId: string; taskId: string; batchId: string; label: string; x: number; y: number; w: number; start: Date; end: Date; backgroundcolor?: string; textColor?: string; }>();

  //   this.taskLayout = [];
  //   for (let r = 0; r < this.rowLayout.length; r++) {
  //     const row = this.rowLayout[r];
  //     for (const task of (row.resource.tasks || [])) {
  //       const s = new Date(task.start as any);
  //       const e = new Date(task.end as any);
  //       const x = this.leftGutter + this.mosService.dateToX(s, this.startDate, this.pxPerHour);
  //       const w = Math.max(4, this.mosService.dateToX(e, this.startDate, this.pxPerHour) - this.mosService.dateToX(s, this.startDate, this.pxPerHour));
  //       const y = row.y;
  //       const backgroundcolor = task.color || this.mosService.getColorForBatch(task.batchId!, this.batches);
  //       const item = { resourceId: row.resource.resourceId, taskId: task.taskId, batchId: task.batchId!, label: task.label, x, y, w, start: s, end: e, backgroundColor: backgroundcolor, textColor: this.mosService.getContrastColor(backgroundcolor) };
  //       this.taskLayout.push(item);
  //       batchById.set(task.taskId, item);
  //     }
  //   }

  //   this.connectors = [];
  //   for (const m of this.resources) {
  //     for (const b of (m.tasks || [])) {
  //       if (!b.successors) continue;
  //       for (const toId of b.successors) {
  //         const from = batchById.get(b.taskId);
  //         const to = batchById.get(toId);
  //         if (!from || !to) continue;
  //         const points = this.makeConnectorPoints(from, to);
  //         this.connectors.push({ from: b.taskId, to: toId, points });
  //       }
  //     }
  //   }
  // }

  private computeEventLayout() {
    // Create a Set of existing batch IDs for efficient lookup
    const existingBatchIds = new Set(this.batches.map(batch => batch.batchId));

    const batchById = new Map<TaskId, { resourceId: string; taskId: string; batchId: string; label: string; x: number; y: number; w: number; start: Date; end: Date; backgroundcolor?: string; textColor?: string; }>();

    this.taskLayout = [];
    for (let r = 0; r < this.rowLayout.length; r++) {
      const row = this.rowLayout[r];
      for (const task of (row.resource.tasks || [])) {
        // Skip tasks whose batch doesn't exist in batches array
        if (!task.batchId || !existingBatchIds.has(task.batchId)) {
          continue;
        }

        const s = new Date(task.start as any);
        const e = new Date(task.end as any);
        const x = this.leftGutter + this.mosService.dateToX(s, this.startDate, this.pxPerHour);
        const w = Math.max(4, this.mosService.dateToX(e, this.startDate, this.pxPerHour) - this.mosService.dateToX(s, this.startDate, this.pxPerHour));
        const y = row.y;
        const backgroundcolor = task.color || this.mosService.getColorForBatch(task.batchId!, this.batches);
        const item = { resourceId: row.resource.resourceId, taskId: task.taskId, batchId: task.batchId!, label: task.label, x, y, w, start: s, end: e, backgroundColor: backgroundcolor, textColor: this.mosService.getContrastColor(backgroundcolor) };
        this.taskLayout.push(item);
        batchById.set(task.taskId, item);
      }
    }

    this.connectors = [];
    for (const m of this.resources) {
      for (const b of (m.tasks || [])) {
        // Skip tasks whose batch doesn't exist in batches array
        if (!b.batchId || !existingBatchIds.has(b.batchId)) {
          continue;
        }

        if (!b.successors) continue;
        for (const toId of b.successors) {
          const from = batchById.get(b.taskId);
          const to = batchById.get(toId);
          if (!from || !to) continue;
          const points = this.makeConnectorPoints(from, to);
          this.connectors.push({ from: b.taskId, to: toId, points });
        }
      }
    }
  }

  private makeConnectorPoints(from: { x: number; y: number; w: number }, to: { x: number; y: number }) {
    const padding = 0; // space between task and arrow
    const x1 = from.x + from.w + padding; // start a bit outside the task
    const y1 = from.y + this.rowHeight / 2;
    const x2 = to.x - padding; // end a bit before the next task
    const y2 = to.y + this.rowHeight / 2;

    const points: string[] = [];
    points.push(`${x1},${y1}`);

    if (y1 === y2) {
      // Same row → straight
      points.push(`${x2},${y2}`);
    } else {
      // Different row → elbow
      // const midX = (x1 + x2) / 2;
      // points.push(`${midX},${y1}`);
      // points.push(`${midX},${y2}`);
      // points.push(`${x2},${y2}`);

      points.push(`${x1 + 8},${y1}`);
      points.push(`${x1 + 8},${y1 + (y2 - y1) / 2}`);
      points.push(`${x2 - 12},${y1 + (y2 - y1) / 2}`);
      points.push(`${x2 - 12},${y2}`);
      points.push(`${x2},${y2}`);

    }

    return points.join(" ");
  }

  onEditTask(task: Task) {
  }

  onDeleteTask(task: Task) {
    let confirmText = `Are you sure you want to delete the task "${task.label}"?`;
    if (confirm(confirmText) === false) {
      return;
    }
    else {
      this.resources = [...this.mosService.deleteTask(task, this.resources)];
      this.recompute();
    }
  }

}
