import { BatchDto } from "./Batch.dto";

export interface TaskDto {
  taskId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  progress: number;
  backgroundColor?: string;
  textColor?: string;
  progressColor?: string;
  status: string;
  batch: BatchDto;
  successors: Successor[];
  predecessors: Predecessor[];
}


export interface Successor { resourceId: string; taskId?: string; }
export interface Predecessor { resourceId: string; taskId?: string; }
