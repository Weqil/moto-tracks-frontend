
import { Routes } from '@angular/router';


export const publicRoutes: Routes = [
  {
    path:'',
    loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
    children:[
      {
        path: 'home',
        loadComponent: () => import('../Pages/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full',
        },
    ]
  },
   
  ];