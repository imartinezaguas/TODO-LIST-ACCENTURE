import { InjectionToken } from '@angular/core';
import { TodoTask } from '../entities/task';

export interface TaskRepository {
  getTasks(categoryName: string): Promise<TodoTask[]>;
  addTask(categoryName: string, taskTitle: string): Promise<TodoTask[]>;
  toggleTask(categoryName: string, task: TodoTask): Promise<TodoTask[]>;
  deleteTask(categoryName: string, index: number): Promise<TodoTask[]>;
}

export const TASK_REPOSITORY_TOKEN = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
