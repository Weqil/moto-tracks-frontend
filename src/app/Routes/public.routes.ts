
import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../Pages/Authorization/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'registration',
    loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
  },
];
