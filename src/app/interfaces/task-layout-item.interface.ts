export interface TaskLayoutItem {
  resourceId: string;
  taskId: string;
  batchId: string,
  name: string;
  description?: string;

  startDate: Date;
  endDate: Date;
  duration: number;
  progress: number;

  status: string;

  backgroundColor?: string;
  textColor?: string;
  progressColor?: string;

  x: number;
  y: number;
  w: number;
}
