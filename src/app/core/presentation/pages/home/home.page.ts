import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCategoryUseCase } from 'src/app/core/application/category/add-category.usecase';
import { DeleteCategoryUseCase } from 'src/app/core/application/category/delete-category.usecase';
import { UpdateCategoryUseCase } from 'src/app/core/application/category/update-category.usecase';
import {
  CANCEL,
  CANCELAR,
  CATEGORY_DETAIL,
  COMFIRM,
  HEADER_CATEGORY,
  HOME,
  MESSAGE_ALERT,
  NAME_ALERT,
  SAVE,
  TYPE_ALERT,
} from '../../constants/const';
import { Category } from 'src/app/core/domain/entities/category';
import { NewCategoryModalComponent } from '../../components/new-category-modal/new-category-modal.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { GetCategoriesUseCase } from 'src/app/core/application/category/get-categories.usecase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryCardComponent,
    SearchBarComponent,
  ],
  standalone: true,
})
export class HomePage implements OnInit {
  searchTerm = '';
  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private getCategories: GetCategoriesUseCase,
    private addCategory: AddCategoryUseCase,
    private deleteCategoryUC: DeleteCategoryUseCase,
    private updateCategoryUC: UpdateCategoryUseCase
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === HOME) {
          this.loadCategories();
        }
      });
  }

  async ngOnInit() {
    await this.loadCategories();
  }

  private async loadCategories() {
    this.categories = await this.getCategories.execute();
  }

  get filteredCategories(): Category[] {
    if (!this.searchTerm.trim()) return this.categories;
    return this.categories.filter((cat) =>
      cat.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: NewCategoryModalComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === COMFIRM && data) {
      await this.addCategory.execute(data);
      await this.loadCategories();
    }
  }

  async deleteCategory(index: number) {
    const category = this.categories[index];
    await this.deleteCategoryUC.execute(category.id || '');
    await this.loadCategories();
  }

  openCategory(cat: Category) {
    this.router.navigate([CATEGORY_DETAIL, cat.id], {
      queryParams: { title: cat.title },
    });
  }

  async editCategory(index: number) {
    const category = this.categories[index];

    const alert = await this.alertCtrl.create({
      header: HEADER_CATEGORY,
      inputs: [
        {
          name: NAME_ALERT,
          type: TYPE_ALERT,
          value: category.title,
          placeholder: MESSAGE_ALERT,
        },
      ],
      buttons: [
        { text: CANCELAR, role: CANCEL },
        {
          text: SAVE,
          handler: async (data) => {
            if (!data.title.trim()) return false;
            category.title = data.title.trim();
            await this.updateCategoryUC.execute(category);
            await this.loadCategories();
            return true;
          },
        },
      ],
    });

    await alert.present();
  }
}
