import { TodoTask } from "./task";

export interface Category {
  title: string;
  tasks: TodoTask[];
  completed: number;
  total?: number;
  color: string;
  icon: string;

}
