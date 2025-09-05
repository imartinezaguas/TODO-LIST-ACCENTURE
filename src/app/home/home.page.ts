import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { NewCategoryModalComponent } from '../components/new-category-modal/new-category-modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { Category } from '../interfaces/category';
import { StorageService } from '../services/storage-service';
import { filter } from 'rxjs/operators';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryCardComponent } from '../components/category-card/category-card.component';
import { CANCEL, CANCELAR, CATEGORY_DETAIL, COMFIRM, HEADER_CATEGORY, HOME, MESSAGE_ALERT, NAME_ALERT, SAVE, TYPE_ALERT } from '../constants/const';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, CategoryCardComponent, SearchBarComponent],
  standalone: true,
})
export class HomePage implements OnInit {
  searchTerm = '';
  categories: Category[] = [];

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storageService: StorageService,
    private alertCtrl: AlertController
  ) {
    // 🔹 Recargar categorías cada vez que regresas a Home
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.router.url === HOME) {
          this.loadCategories();
        }
      });
  }

  async ngOnInit() {
    this.loadCategories();
  }

  private async loadCategories() {
    const rawCategories = await this.storageService.getCategories();
    this.categories = rawCategories.map((cat) => ({
      ...cat,
      total: cat.total ?? (Array.isArray(cat.tasks) ? cat.tasks.length : 0),
      completed:
        cat.completed ??
        (Array.isArray(cat.tasks)
          ? cat.tasks.filter((t) => t.completed).length
          : 0),
    }));
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
      // enriquecer nueva categoría también
      const newCategory = {
        ...data,
        total:
          data.total ?? (Array.isArray(data.tasks) ? data.tasks.length : 0),
        completed:
          data.completed ??
          (Array.isArray(data.tasks)
            ? data.tasks.filter((t: any) => t.completed).length
            : 0),
      };

      this.categories.push(newCategory);
      await this.storageService.addCategory(newCategory);
    }
  }

  async deleteCategory(index: number) {
    this.categories.splice(index, 1);
    await this.storageService.deleteCategory(index);
  }

  openCategory(cat: any) {
    this.router.navigate([CATEGORY_DETAIL, cat.title.toLowerCase()]);
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
        text: SAVE ,
        handler: async (data) => {
          if (!data.title.trim()) return false; // evita vacío
          this.categories[index].title = data.title.trim();
          await this.storageService.updateCategory(index, this.categories[index]);
          return true;
        },
      },
    ],
  });

  await alert.present();
}

}
