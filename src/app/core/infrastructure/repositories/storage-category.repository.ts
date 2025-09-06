import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CategoryRepository } from '../../domain/repositories/category-repositories';
import { CATEGORY_KEY } from 'src/app/core/presentation/constants/const';
import { Category } from '../../domain/entities/category';

@Injectable({ providedIn: 'root' })
export class StorageCategoryRepository implements CategoryRepository {
  constructor(private storage: StorageService) {}

  async getAll(): Promise<Category[]> {
    const data = await this.storage.get<Category[]>(CATEGORY_KEY);
    return Array.isArray(data) ? data : [];
  }

  async add(category: Category): Promise<void> {
    const categories = await this.getAll();

    categories.push(category);
    await this.storage.set(CATEGORY_KEY, categories);
  }

  async update(category: Category): Promise<void> {
    let categories = await this.getAll();
    categories = categories.map((c) => (c.id === category.id ? category : c));
    await this.storage.set(CATEGORY_KEY, categories);
  }

  async delete(id: string): Promise<void> {
    const categories = await this.getAll();
    const filtered = categories.filter((c) => c.id !== id);
    await this.storage.set(CATEGORY_KEY, filtered);
  }
}
