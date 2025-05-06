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
          redirectTo: 'events',
          pathMatch: 'full',
      },
      {
        path:'tracks',
        loadComponent: () => import('../Pages/Track/track-tape-page/track-tape-page.component').then((m) => m.TrackTapePageComponent),
      },
      {
        path:'teams',
        loadComponent: () => import('../Pages/Events/teams-list-page/teams-list-page.component').then((m) => m.TeamsListPageComponent),
      },
      {
        path:'favorites',
        loadComponent: () => import('../Pages/Profile/favorites-page/favorites-page.component').then((m) => m.FavoritesPageComponent),
      },
      {
        path:'events',
        loadComponent: () => import('../Pages/Events/events-tape-page/events-tape-page.component').then((m) => m.EventsTapePageComponent),
      },
      {
        path:'racer/:id',
        loadComponent: () => import('../Pages/racer-view-page/racer-view-page.component').then((m) => m.RacerViewPageComponent)
      },
      {
        path:'rating',
        loadComponent: () => import('../Pages/rating/rating.component').then((m) => m.RatingComponent)
      },
      {
        path:'linarikUI',
        loadComponent: () => import('../Pages/linarik-ui/linarik-ui.component').then((m) => m.LinarikUiComponent)
      },
      {
        path:'view-document/:url',
        loadComponent: () => import('../CommonUI/Pages/view-document/view-document.component').then((m) => m.ViewDocumentComponent)
      },
      {
        path:'user-agreement',
        loadComponent: () => import('../Pages/Authorization/user-agreement/user-agreement.component').then((m) => m.UserAgreementComponent)
      },
      {
        path:'user-politic',
        loadComponent: () => import('../Pages/Authorization/user-politic/user-politic.component').then((m) => m.UserPoliticComponent)
      },
      {
        path:'distribution-agreement',
        loadComponent: () => import('../Pages/Authorization/distribution-agreement/distribution-agreement.component').then((m) => m.DistributionAgreementComponent)
      },

      
    ]
  },
  
    {
      path:'event/:id',
      loadComponent: () => import('../Pages/Events/events-view-page/events-view-page.component').then((m) => m.EventsViewPageComponent)
    },
    {
      path:'track/:id',
      loadComponent: () => import('../Pages/Track/track-view-page/track-view-page.component').then((m) => m.TrackViewPageComponent)
    },
    {
      path:'test-payment',
      loadComponent: () => import('../Pages/test-payment/test-payment.component').then((m)=> m.TestPaymentComponent)
    }
   
  ];