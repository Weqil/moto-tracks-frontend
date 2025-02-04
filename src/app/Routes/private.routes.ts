

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
            {
                path:'create-track',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/Tracks/create-track-page/create-track-page.component').then((m) => m.CreateTrackPageComponent)
            },
            {
                path: 'create-event',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/Events/create-events-page/create-events-page.component').then((m) => m.CreateEventsPageComponent)
            },
            {
                path:'my-events',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/Events/my-events-page/my-events-page.component').then((m) => m.MyEventsPageComponent)
            },
            {
                path:'personal-info',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/personal-info/personal-info.component').then((m) => m.PersonalInfoComponent)
            },
            {
                path:'documents',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/user-documents/user-documents.component').then((m) => m.UserDocumentsComponent)
            },
            {
                path:'settings',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/settings/settings.component').then((m) => m.SettingsComponent)
            },
            {
                path:'verification',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Authorization/confirm-email-page/confirm-email-page.component').then((m) => m.ConfirmEmailPageComponent)
            }
        ]
    }
 
];
