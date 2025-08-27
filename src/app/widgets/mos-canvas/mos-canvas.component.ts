import { Component, effect } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { TaskId } from '../../interfaces/task.interface';
import { ZoomService } from '../../services/zoom.service';
import { TaskComponent } from '../events/task/task.component';
import { MosService } from '../../services/mos.service';
import { BatchDto } from '../../Dtos/Batch.dto';
import { ResourceDto } from '../../Dtos/Resource.dto';
import { TaskLayoutItem } from '../../interfaces/task-layout-item.interface';
import { HolidayLayoutItem } from '../../interfaces/holiday-layout-item.interface';
import { HolidayDto } from '../../Dtos/Holiday.dto';
import { HolidayComponent } from '../events/holiday/holiday.component';
import { environment } from '../../../environments/environment.development';
import { max } from 'rxjs';

@Component({
  selector: 'app-mos-canvas',
  imports: [TaskComponent, HolidayComponent],
  templateUrl: './mos-canvas.component.html',
  styleUrl: './mos-canvas.component.scss'
})
export class MosCanvasComponent {

  protected batches: BatchDto[] = [];
  protected resources: ResourceDto[] = [];
  private clonedResources: ResourceDto[] = [];
  protected holidays: HolidayDto[] = []

  todayX: number | null = null;
  leftGutter = 0;

  gridLineDays: { x: number; label: string; }[] = [];
  gridLineHours: { x: number; label: string; }[] = [];
  showGridLineHours: boolean = false;

  pxPerHour = environment.pxPerHour;
  rowHeight = 48;

  totalWidth = 1000;
  totalHeight = 300;
  headerHeight = 30;
  timeWidth = 0;
  rowLayout: { resource: ResourceDto; y: number; }[] = [];

  private startDate: Date = new Date('2025-01-01T00:00:00Z');
  private endDate: Date = new Date('2025-01-02T00:00:00Z');

  holidayLayout: Array<HolidayLayoutItem> = [];
  taskLayout: Array<TaskLayoutItem> = [];
  connectors: Array<{ from: string; to: string; points: string; }> = [];

  constructor(
    private utilityService: UtilityService,
    private zoomService: ZoomService,
    private readonly mosService: MosService
  ) {
    effect(() => {
      this.batches = this.mosService.batches();
      this.resources = this.mosService.resources();
      this.clonedResources = structuredClone(this.resources)
      this.holidays = this.mosService.holidays()
      this.pxPerHour = this.zoomService.pxPerHour();
      this.showGridLineHours = this.mosService.showGridLineHours();
      // this.startDate = mosService.startDate()
      // this.endDate = mosService.endDate()
      // this.computeStartEndDates()
      // this.computeTodayX()
      this.recompute();
    });
  }

  ngOnChanges() { }

  private recompute() {
    this.computeStartEndDatesTodays()
    this.computeCanvasLayout()
    this.computeEventLayout()
  }

  private computeStartEndDatesTodays() {
    // Calculate the minimum and maximum dates from the resources
    const { minDate, maxDate } = this.utilityService.getMinMaxDates(this.resources);

    // check if minDate and Maxdate is valid
    // if (!this.utilityService.isValidDate(minDate) || this.utilityService.isValidDate(maxDate)) {
    //   return;
    // }

    this.startDate = minDate;
    this.endDate = maxDate;

    this.mosService.startDate.set(minDate)
    this.mosService.endDate.set(maxDate)

    const t = new Date();
    if (t < this.startDate || t > this.endDate) {
      this.todayX = null;
    } else {
      this.todayX = this.leftGutter + this.utilityService.dateToX(t, this.startDate, this.pxPerHour);
    }
  }

  private computeStartEndDates() {
    const { minDate, maxDate } = this.utilityService.getMinMaxDates(this.resources);

    // check if minDate and Maxdate is valid
    if (!this.utilityService.isValidDate(minDate) || this.utilityService.isValidDate(maxDate)) {
      return;
    }
    this.mosService.startDate.set(minDate)
    this.mosService.endDate.set(maxDate)
  }

  private computeTodayX() {
    const t = new Date();
    if (t < this.startDate || t > this.endDate) {
      this.todayX = null;
    } else {
      this.todayX = this.leftGutter + this.utilityService.dateToX(t, this.startDate, this.pxPerHour);
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
      const x = this.leftGutter + this.utilityService.dateToX(new Date(t), this.startDate, this.pxPerHour);
      this.gridLineDays.push({ x, label: new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) });
    }


    // Compute grid lines for each hour within the date range
    this.gridLineHours = [];
    const hourMs = 3600 * 1000;
    const firstHour = new Date(this.startDate); firstHour.setMinutes(0, 0, 0);
    for (let t = firstHour.getTime(); t <= this.endDate.getTime(); t += hourMs) {
      const d = new Date(t);
      const x = this.leftGutter + this.utilityService.dateToX(d, this.startDate, this.pxPerHour);
      this.gridLineHours.push({ x, label: d.getHours().toString().padStart(2, '0') }); //+ ":00"
    }
  }


  private computeEventLayout() {
    // Create a Set of existing batch IDs for efficient lookup
    const existingBatchIds = new Set(this.batches.map(batch => batch.batchId));

    const batchById = new Map<TaskId, TaskLayoutItem>();
    this.taskLayout = [];
    for (let r = 0; r < this.rowLayout.length; r++) {
      const row = this.rowLayout[r];
      for (const task of (row.resource.tasks || [])) {
        // Skip tasks whose batch doesn't exist in batches array
        if (!task.batch.batchId || !existingBatchIds.has(task.batch.batchId)) {
          continue;
        }

        const s = new Date(task.startDate as any);
        const e = new Date(task.endDate as any);
        const x = this.leftGutter + this.utilityService.dateToX(s, this.startDate, this.pxPerHour) + 2;
        const w = Math.max(4, this.utilityService.dateToX(e, this.startDate, this.pxPerHour) - this.utilityService.dateToX(s, this.startDate, this.pxPerHour)) - 4;
        const y = row.y;
        const item: TaskLayoutItem = {
          resourceId: row.resource.resourceId,
          taskId: task.taskId,
          batchId: task.batch.batchId!,
          name: task.name,
          description: task.description,

          startDate: task.startDate,
          endDate: task.endDate,
          duration: task.duration,
          progress: task.progress,

          status: task.status,

          backgroundColor: task.backgroundColor,
          textColor: task.textColor,
          // progressColor: task.progressColor,
          progressColor: this.utilityService.darkenColor(task.backgroundColor!, 15),

          x,
          y,
          w
        };
        this.taskLayout.push(item);
        batchById.set(task.taskId, item);
      }
    }

    this.holidayLayout = []
    for (let r = 0; r < this.rowLayout.length; r++) {
      const row = this.rowLayout[r];
      for (let h of (this.holidays || [])) {
        const s = new Date(h.startDate);
        const e = new Date(h.endDate);
        const x = this.leftGutter + this.utilityService.dateToX(s, this.startDate, this.pxPerHour) + 2;
        const w = Math.max(4, this.utilityService.dateToX(e, this.startDate, this.pxPerHour) - this.utilityService.dateToX(s, this.startDate, this.pxPerHour)) - 4;
        const y = row.y;

        const item: HolidayLayoutItem = {
          holidayId: h.holidayId,
          holidayName: h.holidayName,
          holidayType: h.holidayType,

          startDate: h.startDate,
          endDate: h.endDate,
          duration: h.duration,

          x,
          y,
          w
        };
        this.holidayLayout.push(item);

      }
    }

    this.connectors = [];
    for (const m of this.resources) {
      for (const b of (m.tasks || [])) {
        // Skip tasks whose batch doesn't exist in batches array
        if (!b.batch.batchId || !existingBatchIds.has(b.batch.batchId)) {
          continue;
        }

        if (!b.successors) continue;
        for (const toId of b.successors) {
          const from = batchById.get(b.taskId);
          const to = batchById.get(toId.taskId!);
          if (!from || !to) continue;
          const points = this.makeConnectorPoints(from, to);
          this.connectors.push({ from: b.taskId, to: toId.taskId!, points });
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

  onClickTask(task: TaskLayoutItem) {
    // this.onRightClickTask(task)
    // setTimeout(() => {
    //   this.highlightSuccessors(task.resourceId, task.taskId, new Set());
    //   this.highlightPredecessors(task.resourceId, task.taskId, new Set());
    //   this.recompute()
    // }, 300);
    this.highlightSuccessors(task.resourceId, task.taskId, new Set());
    this.highlightPredecessors(task.resourceId, task.taskId, new Set());
    this.recompute()
  }

  private highlightSuccessors(resourceId: string, taskId: string, visited: Set<string>) {
    const taskKey = `${resourceId}-${taskId}`;
    if (visited.has(taskKey)) return;
    visited.add(taskKey);

    const resource = this.resources.find(f => f.resourceId == resourceId)?.tasks.find(f => f.taskId == taskId);
    if (!resource) return;

    resource.backgroundColor = '#065983';
    resource.textColor = '#fff';

    resource.successors?.forEach(task => {
      this.highlightSuccessors(task.resourceId, task.taskId!, visited);
    });
  }

  private highlightPredecessors(resourceId: string, taskId: string, visited: Set<string>) {
    const taskKey = `${resourceId}-${taskId}`;
    if (visited.has(taskKey)) return;
    visited.add(taskKey);

    const resource = this.resources.find(f => f.resourceId == resourceId)?.tasks.find(f => f.taskId == taskId);
    if (!resource) return;

    resource.backgroundColor = '#065983';
    resource.textColor = '#fff';

    resource.predecessors?.forEach(task => {
      this.highlightPredecessors(task.resourceId, task.taskId!, visited);
    });
  }

  onRightClickTask(task: TaskLayoutItem) {
    this.mosService.resources.set([])
    this.mosService.resources.set([...this.clonedResources])
  }

  onEditTask(task: TaskLayoutItem) {
    console.log(task)
  }

  onDeleteTask(task: TaskLayoutItem) {
    let confirmText = `Are you sure you want to delete the task "${task.name}"?`;
    if (confirm(confirmText) === false) {
      return;
    }
    else {
      this.resources = [...this.utilityService.deleteTask(task, this.resources)];
      this.recompute();
    }
  }

}
