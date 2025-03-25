import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'teams',
    loadComponent: () => import('./Pages/Events/teams-list-page/teams-list-page.component').then(m => m.TeamsListPageComponent)
  }
];
