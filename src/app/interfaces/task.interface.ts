export type TaskId = string;

export interface Task {
  taskId: TaskId;
  batchId?: string;
  label: string;
  start: Date | string;
  end: Date | string;
  color?: string;
  successors?: TaskId[];
}
