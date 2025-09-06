import { Inject, Injectable } from '@angular/core';
import { Category } from '../../domain/entities/category';
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from '../../domain/repositories/category-repositories';

@Injectable({ providedIn: 'root' })
export class AddCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepo: CategoryRepository
  ) {}

  async execute(category: Category): Promise<void> {
    console.log(category)
    await this.categoryRepo.add(category);
  }
}
