import { InjectionToken } from "@angular/core";
import { Category } from "../entities/category";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  add(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}

export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<CategoryRepository>(
  'CATEGORY_REPOSITORY'
);
