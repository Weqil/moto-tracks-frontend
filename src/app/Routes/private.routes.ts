

import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
        children:[
            {
                path:'cabinet',
                loadComponent: () => import('../Pages/Profile/cabinet/cabinet.component').then((m) => m.CabinetComponent)
            }
        ]
    }
 
];
