import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { TodoTask } from '../../domain/entities/task';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  // Obtener tareas de una categoría
  async get<T>(key: string): Promise<T | null> {
    await this.init();
    return (await this._storage?.get(key)) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.init();
    await this._storage?.set(key, value);
  }

  // Método faltante -> actualizar todas las tareas
  async updateTasks(categoryName: string, tasks: TodoTask[]): Promise<void> {
    await this.set(categoryName, tasks);
  }

  // Eliminar categoría
  async deleteCategory(categoryName: string): Promise<void> {
    await this.init();
    await this._storage?.remove(categoryName);
  }
}
