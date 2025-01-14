import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
      path:'',
      loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
      children: [
        
        {
          path: 'login',
          loadComponent: () => import('../Pages/Authorization/login-page/login-page.component').then((m) => m.LoginPageComponent),
        },
        {
          path: 'registration',
          loadComponent: () => import('../Pages/Authorization/registration-page/registration-page.component').then((m) => m.RegistrationPageComponent),
        },
      ],
    },
 
   
  ];