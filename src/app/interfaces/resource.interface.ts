import { Task } from "./task.interface";

export interface Resource {
  resourceId: string;
  name: string;
  tasks: Task[];
}
