import { Inject, Injectable } from "@angular/core";
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from "../../domain/repositories/category-repositories";
import { Category } from "../../domain/entities/category";


@Injectable({ providedIn: 'root' })
export class GetCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepo: CategoryRepository
  ) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepo.getAll();
  }
}
