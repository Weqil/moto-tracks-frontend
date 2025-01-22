
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
          redirectTo: 'tracks',
          pathMatch: 'full',
      },
      {
        path:'tracks',
        loadComponent: () => import('../Pages/Track/track-tape-page/track-tape-page.component').then((m) => m.TrackTapePageComponent),
      },
      {
        path:'favorites',
        loadComponent: () => import('../Pages/Profile/favorites-page/favorites-page.component').then((m) => m.FavoritesPageComponent),
      },
      {
        path:'track/:id',
        loadComponent: () => import('../Pages/Track/track-view-page/track-view-page.component').then((m) => m.TrackViewPageComponent)
      },
      {
        path:'events',
        loadComponent: () => import('../Pages/Events/events-tape-page/events-tape-page.component').then((m) => m.EventsTapePageComponent),
      },
      {
        path:'event/:id',
        loadComponent: () => import('../Pages/Events/events-view-page/events-view-page.component').then((m) => m.EventsViewPageComponent)
      }
    ]
  },
  
   
  ];