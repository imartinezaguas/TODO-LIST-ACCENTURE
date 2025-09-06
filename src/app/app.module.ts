import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireRemoteConfigModule } from '@angular/fire/compat/remote-config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { firebaseConfig } from 'src/environments/environment.prod';
import { TASK_REPOSITORY_TOKEN } from './core/domain/repositories/task-respositories';
import { StorageTaskRepository } from './core/infrastructure/repositories/storage-task.repository';
import { CATEGORY_REPOSITORY_TOKEN } from './core/domain/repositories/category-repositories';
import { StorageCategoryRepository } from './core/infrastructure/repositories/storage-category.repository';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireRemoteConfigModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: CATEGORY_REPOSITORY_TOKEN, useClass: StorageCategoryRepository },
     { provide: TASK_REPOSITORY_TOKEN, useClass: StorageTaskRepository }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
