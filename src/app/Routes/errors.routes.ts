

import { Routes } from '@angular/router';

//Файл хранит вспомогательные роуты, например notFound
export const errorsRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('../CommonUI/Pages/not-found-pages/not-found-pages.component').then((m) => m.NotFoundPagesComponent),
  },
  
];
