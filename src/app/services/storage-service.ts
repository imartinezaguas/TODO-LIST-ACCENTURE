import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../interfaces/category';
import { CATEGORY_KEY } from '../constants/const';
import { TodoTask } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    this._storage = await this.storage.create();
  }

  // Garantiza que el storage esté listo antes de usarlo
  private async ensureStorageReady() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  // Obtener categorías
  async getCategories(): Promise<Category[]> {
    await this.ensureStorageReady();
    return (await this._storage?.get(CATEGORY_KEY)) || [];
  }

  // Agregar categoría
  async addCategory(category: Category): Promise<void> {
    await this.ensureStorageReady();
    const categories = (await this._storage?.get(CATEGORY_KEY)) || [];
    categories.push(category);
    await this._storage?.set(CATEGORY_KEY, categories);
  }

  // Eliminar por índice
  async deleteCategory(index: number): Promise<void> {
    await this.ensureStorageReady();
    const categories = (await this._storage?.get(CATEGORY_KEY)) || [];
    categories.splice(index, 1);
    await this._storage?.set(CATEGORY_KEY, categories);
  }

  // Limpiar todo
  async clearCategories(): Promise<void> {
    await this.ensureStorageReady();
    await this._storage?.remove(CATEGORY_KEY);
  }

  async updateCategory(
    index: number,
    updatedCategory: Category
  ): Promise<void> {
    await this.ensureStorageReady();
    const categories = (await this._storage?.get(CATEGORY_KEY)) || [];
    categories[index] = updatedCategory;
    await this._storage?.set(CATEGORY_KEY, categories);
  }

  // ========== Tareas ==========
  async getTasks(categoryTitle: string): Promise<TodoTask[]> {
    await this.ensureStorageReady();
    const categories = await this.getCategories();
    const category = categories.find(
      (c) => c.title.toLowerCase() === categoryTitle.toLowerCase()
    );
    return category ? category.tasks : [];
  }

  async addTask(categoryTitle: string, task: TodoTask): Promise<void> {
    await this.ensureStorageReady();
    const categories = await this.getCategories();
    const index = categories.findIndex(
      (c) => c.title.toLowerCase() === categoryTitle.toLowerCase()
    );
    if (index !== -1) {
      categories[index].tasks.push(task);
      categories[index].total = categories[index].tasks.length;
      categories[index].completed = categories[index].tasks.filter(
        (t) => t.completed
      ).length;
      await this._storage?.set(CATEGORY_KEY, categories);
    }
  }

  async updateTasks(categoryTitle: string, tasks: TodoTask[]): Promise<void> {
    await this.ensureStorageReady();
    const categories = await this.getCategories();
    const index = categories.findIndex(
      (c) => c.title.toLowerCase() === categoryTitle.toLowerCase()
    );
    if (index !== -1) {
      categories[index].tasks = tasks;
      categories[index].total = tasks.length;
      categories[index].completed = tasks.filter((t) => t.completed).length;
      await this._storage?.set(CATEGORY_KEY, categories);
    }
  }

  async deleteTask(categoryTitle: string, taskIndex: number): Promise<void> {
    await this.ensureStorageReady();
    const categories = await this.getCategories();
    const index = categories.findIndex(
      (c) => c.title.toLowerCase() === categoryTitle.toLowerCase()
    );
    if (index !== -1) {
      categories[index].tasks.splice(taskIndex, 1);
      await this._storage?.set(CATEGORY_KEY, categories);
    }
  }
}
