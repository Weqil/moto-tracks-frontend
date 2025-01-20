

import { Routes } from '@angular/router';
import { canActivateAuth } from '../Shared/Guards/Auth/auth.guard';

export const privateRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
        children:[
            {
                path:'cabinet',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/cabinet/cabinet.component').then((m) => m.CabinetComponent)
            },
            {
                path:'my-tracks',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/Tracks/my-tracks-page/my-tracks-page.component').then((m) => m.MyTracksPageComponent)
            },
        ]
    }
 
];
