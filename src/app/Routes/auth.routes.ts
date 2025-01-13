import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
      path: 'login',
      loadComponent: () => import('../Pages/Authorization/login-page/login-page.component').then((m) => m.LoginPageComponent),
    },
    {
      path: 'registration',
      loadComponent: () => import('../Pages/Authorization/registration-page/registration-page.component').then((m) => m.RegistrationPageComponent),
    },
  ];