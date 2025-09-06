import { Inject, Injectable } from "@angular/core";
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from "../../domain/repositories/category-repositories";

@Injectable({ providedIn: 'root' })
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepo: CategoryRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
