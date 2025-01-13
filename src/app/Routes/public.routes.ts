
import { Routes } from '@angular/router';


export const publicRoutes: Routes = [
    {
      path: 'home',
      loadComponent: () => import('../Pages/home-page/home-page.component').then((m) => m.HomePageComponent),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
  ];