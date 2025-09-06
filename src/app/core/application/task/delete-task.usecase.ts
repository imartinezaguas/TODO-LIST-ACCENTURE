import { Inject, Injectable } from "@angular/core";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";
import { TodoTask } from "../../domain/entities/task";

@Injectable({ providedIn: 'root' })
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository
  ) {}
  async execute(categoryName: string, index: number): Promise<TodoTask[]> {
    return this.taskRepo.deleteTask(categoryName, index);
  }
}
