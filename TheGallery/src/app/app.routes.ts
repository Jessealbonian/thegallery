import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ImageUploadComponent } from './components/Uploadimage/upload.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: ImageUploadComponent },
  { path: 'add-comment', component: AddCommentComponent }
];
