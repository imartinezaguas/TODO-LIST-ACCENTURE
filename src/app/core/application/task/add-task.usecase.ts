import { Inject, Injectable } from '@angular/core';
import { TodoTask } from '../../domain/entities/task';
import { TASK_REPOSITORY_TOKEN, TaskRepository } from '../../domain/repositories/task-respositories';

@Injectable({ providedIn: 'root' })
export class AddTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}

  async execute(categoryName: string, taskTitle: string): Promise<TodoTask[]> {
    return this.taskRepo.addTask(categoryName, taskTitle);
  }
}
