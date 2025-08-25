import { TaskDto } from "./Task.dto";

export interface ResourceDto {
  resourceId: string;
  name: string;
  description: string;
  tasks: TaskDto[];
}
