import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  COLOR_DANGER,
  DURATION_TOAST,
  ENABLE_ADD_TASK,
  MESSAGE_TASK_TOAST,
  POSITION_TOAST,
} from 'src/app/constants/const';
import { TodoTask } from 'src/app/interfaces/task';
import { FeatureFlagServiceService } from 'src/app/services/feature-flag-service';
import { StorageService } from 'src/app/services/storage-service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {
  categoryName = '';
  newTask = '';
  tasks: TodoTask[] = [];
  searchTask = '';
  buttonTaskEnable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private featureFlag: FeatureFlagServiceService
  ) {
    this.categoryName = this.route.snapshot.paramMap.get('id') ?? '';
  }

  async ngOnInit() {
    // Cargar las tareas de la categoría desde storage
    this.tasks = await this.storageService.getTasks(this.categoryName);
    this.buttonTaskEnable = await this.featureFlag.isFeatureEnabled(
      ENABLE_ADD_TASK
    );
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  // Agregar nueva tarea
  async addTask() {
    if (!this.newTask.trim()) {
      const toast = await this.toastCtrl.create({
        message: MESSAGE_TASK_TOAST,
        duration: DURATION_TOAST,
        color: COLOR_DANGER,
        position: POSITION_TOAST,
      });
      await toast.present();
      return;
    }

    const task: TodoTask = { title: this.newTask.trim(), completed: false };

    this.tasks.push(task);

    // Guardar en storage
    await this.storageService.addTask(this.categoryName, task);

    this.newTask = '';
  }

  //Marcar / desmarcar completada
  async toggleTask(task: TodoTask) {
    task.completed = !task.completed;
    await this.storageService.updateTasks(this.categoryName, this.tasks);
  }

  get filteredTasks(): TodoTask[] {
    if (!this.searchTask.trim()) return this.tasks;
    return this.tasks.filter((t) =>
      t.title.toLowerCase().includes(this.searchTask.toLowerCase())
    );
  }

  async deleteTask(index: number) {
    this.tasks.splice(index, 1); // eliminar en memoria
    await this.storageService.updateTasks(this.categoryName, this.tasks); // guardar cambios
  }
}
