import { Inject, Injectable } from "@angular/core";
import { TodoTask } from "../../domain/entities/task";
import { TASK_REPOSITORY_TOKEN, TaskRepository } from "../../domain/repositories/task-respositories";

@Injectable({ providedIn: 'root' })
export class GetTasksByCategoryUseCase {
  constructor(@Inject(TASK_REPOSITORY_TOKEN) private taskRepo: TaskRepository) {}

  async execute(categoryId: string): Promise<TodoTask[]> {
    return await this.taskRepo.getTasks(categoryId);
  }
}
