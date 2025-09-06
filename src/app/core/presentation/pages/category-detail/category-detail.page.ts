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
} from 'src/app/core/presentation/constants/const';
import { TodoTask } from 'src/app/core/domain/entities/task';

// Casos de uso (Application Layer)


// Servicio de feature flags (Infraestructura)
import { FeatureFlagServiceService } from 'src/app/core/infrastructure/services/feature.service';
import { AddTaskUseCase } from 'src/app/core/application/task/add-task.usecase';
import { ToggleTaskUseCase } from 'src/app/core/application/task/toggle-task.usecase';
import { DeleteTaskUseCase } from 'src/app/core/application/task/delete-task.usecase';
import { GetTasksByCategoryUseCase } from 'src/app/core/application/task/get-tasks-by-category.usecase';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {
  categoryName = '';
  categoryId ='' ;
  newTask = '';
  tasks: TodoTask[] = [];
  searchTask = '';
  buttonTaskEnable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private featureFlag: FeatureFlagServiceService,

    // Inyección de casos de uso
    private getTasksUC: GetTasksByCategoryUseCase,
    private addTaskUC: AddTaskUseCase,
    private toggleTaskUC: ToggleTaskUseCase,
    private deleteTaskUC: DeleteTaskUseCase
  ) {
    this.categoryName = this.route.snapshot.queryParamMap.get('title') ?? '';
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  async ngOnInit() {
    this.tasks = await this.getTasksUC.execute(this.categoryId);
    this.buttonTaskEnable = await this.featureFlag.isFeatureEnabled(ENABLE_ADD_TASK);
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

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
    console.log(this.categoryName, this.newTask.trim())
    const updatedTasks = await this.addTaskUC.execute(this.categoryId, this.newTask.trim());
    this.tasks = updatedTasks;
    this.newTask = '';
  }

  async toggleTask(task: TodoTask) {
    const updatedTasks = await this.toggleTaskUC.execute(this.categoryId, task);
    this.tasks = updatedTasks;
  }

  async deleteTask(index: number) {
    const updatedTasks = await this.deleteTaskUC.execute(this.categoryId, index);
    this.tasks = updatedTasks;
  }

  get filteredTasks(): TodoTask[] {
    if (!this.searchTask.trim()) return this.tasks;
    return this.tasks.filter((t) =>
      t.title.toLowerCase().includes(this.searchTask.toLowerCase())
    );
  }
}
