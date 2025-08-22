export type TaskId = string;
export enum TaskStatus {
  Locked = 'locked',
  InProgress = 'in-progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Failed = 'failed',
  Planned = 'planned',
  OnHold = 'on-hold',
}

export interface Task {
  taskId: TaskId;
  batchId?: string;
  label: string;
  description?: string;

  start: Date | string;
  end: Date | string;
  duration?: number; // Duration in minutes

  status?: TaskStatus; // Task status
  progress?: number; // Progress in percentage e.g 0-100

  color?: string;

  backgroundColor?: string; // Background color for the task, which will be come from batch color
  textColor?: string // Text color for the task label will be auto identified based on background color
  progressColor?: string; // Color for progress bar

  successors?: TaskId[];
}
