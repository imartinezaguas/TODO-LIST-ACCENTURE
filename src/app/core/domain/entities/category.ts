import { TodoTask } from "./task";


export interface Category {
  id?: string;
  title: string;
  tasks: TodoTask[];
  completed: number;
  total?: number;
  color: string;
  icon: string;

}
