import { Inject, Injectable } from "@angular/core";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";
import { TodoTask } from "../../domain/entities/task";

@Injectable({ providedIn: 'root' })
export class ToggleTaskUseCase {
   constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}

  async execute(categoryName: string, task: TodoTask): Promise<TodoTask[]> {
    return this.taskRepo.toggleTask(categoryName, task);
  }
}
