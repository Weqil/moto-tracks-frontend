

import { Routes } from '@angular/router';
import { canActivateAuth } from '../Shared/Guards/Auth/auth.guard';
import { canActivateEmailConfirm } from '../Shared/Guards/Auth/email-confirm.guard';
import { canActivateRoleAdmin } from '../Shared/Guards/Auth/role-admin.guard';

export const privateRoutes: Routes = [
    {
        path:'',
        loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
        children:[
            {
                path:'document/:id',
                canActivate:[canActivateAuth,canActivateEmailConfirm, canActivateRoleAdmin],
                loadComponent: () => import('../CommonUI/Pages/private-files/private-files.component').then((m) => m.PrivateFilesComponent)
            },
            {
                path:'cabinet',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/cabinet/cabinet.component').then((m) => m.CabinetComponent),

            },
            {
                path:'my-tracks',
                canActivate:[canActivateAuth,canActivateEmailConfirm],
                loadComponent: () => import('../Pages/Profile/Tracks/my-tracks-page/my-tracks-page.component').then((m) => m.MyTracksPageComponent)
            },
            
            
            {
                path:'my-events',
                canActivate:[canActivateAuth,canActivateEmailConfirm],
                loadComponent: () => import('../Pages/Profile/Events/my-events-page/my-events-page.component').then((m) => m.MyEventsPageComponent)
            },
            {
                path:'personal-info',
                canActivate:[canActivateAuth,canActivateEmailConfirm],
                loadComponent: () => import('../Pages/Profile/personal-info/personal-info.component').then((m) => m.PersonalInfoComponent)
            },
            {
                path:'documents',
                canActivate:[canActivateAuth,canActivateEmailConfirm],
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
            },
            {
                path:'racer/edit/:id',
                canActivate:[canActivateAuth,canActivateEmailConfirm],
                loadComponent: () => import('../Pages/Profile/Events/edit-event/edit-event.component').then((m) => m.EditEventComponent)
            },
        ]
    },

    {
        path: 'create-event',
        canActivate:[canActivateAuth,canActivateEmailConfirm],
        loadComponent: () => import('../Pages/Profile/Events/create-events-page/create-events-page.component').then((m) => m.CreateEventsPageComponent)
    },
    
    {
        path:'create-track',
        canActivate:[canActivateAuth,canActivateEmailConfirm],
        loadComponent: () => import('../Pages/Profile/Tracks/create-track-page/create-track-page.component').then((m) => m.CreateTrackPageComponent)
    },
 
];
