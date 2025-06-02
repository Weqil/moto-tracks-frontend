import { Routes } from '@angular/router';
import { canActivateAuth } from '../Shared/Guards/Auth/auth.guard';
import {  } from '../Shared/Guards/Auth/email-confirm.guard';
import { canActivateRoleAdmin } from '../Shared/Guards/Auth/role-admin.guard';
import { canActivateUserHaveRole } from '../Shared/Guards/Auth/role.guard';
import { UserService } from '../Shared/Data/Services/User/user.service';
import { inject } from '@angular/core';
import { userRoles } from '../Shared/Data/Enums/roles';


export const privateRoutes: Routes = [

    {
        path:'',
        loadComponent: () => import('../CommonUI/Pages/pages-with-nav/pages-with-nav.component').then((m) => m.PagesWithNavComponent),
        children:[
            {
                path:'cabinet',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/cabinet/cabinet.component').then((m) => m.CabinetComponent),
        
            },
            {
                path:'track-payment/:id/:price',
                canActivate:[canActivateAuth],
                 loadComponent: () => import('../Pages/Track/track-payment/track-payment.component').then((m)=> m.TrackPaymentComponent)

            },
            {
                path:'event-payment/:id',
                canActivate:[canActivateAuth],
                 loadComponent: () => import('../Pages/Events/event-payment/event-payment.component').then((m)=> m.EventPaymentComponent)

            },
            {
                path:'document/:id',
                canActivate:[canActivateAuth,canActivateRoleAdmin],
                loadComponent: () => import('../CommonUI/Pages/private-files/private-files.component').then((m) => m.PrivateFilesComponent)
            },
           
               
               
            
            {
                path:'personal-info',
                canActivate:[canActivateAuth,],
                loadComponent: () => import('../Pages/Profile/personal-info/personal-info.component').then((m) => m.PersonalInfoComponent)
            },
            {
                path:'documents',
                canActivate:[canActivateAuth,],
                loadComponent: () => import('../Pages/Profile/user-documents/user-documents.component').then((m) => m.UserDocumentsComponent)
            },
            {
                path:'settings',
                canActivate:[canActivateAuth,],
                loadComponent: () => import('../Pages/Profile/settings/settings.component').then((m) => m.SettingsComponent)
            },
            
            
          
            
            {
                path:'aplication/confirm/:id',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/comission/confirm-aplication/confirm-aplication.component').then((m) => m.ConfirmAplicationComponent)
            },
            {
                path: 'command/view/:id',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/comands/view-comand-page/view-comand-page.component').then((m) => m.ViewComandPageComponent)
            },
            {
                path: 'teams',
                loadComponent: () => import('../Pages/Events/teams-list-page/teams-list-page.component').then(m => m.TeamsListPageComponent)
            },

            {
                path: 'users/:id',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Users/user-view-page/user-view-page.component').then((m) => m.UserViewPageComponent)
                
            },
            {
                path:'add-users-in-comissions',
                canActivate:[canActivateAuth,canActivateUserHaveRole([userRoles.commission],'комиссия')],
                loadComponent: () => import('../Pages/Profile/add-user-in-comission/add-user-in-comission.component').then((m) => m.AddUserInComissionComponent)
            },
            {
                path:'transactions',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/transactions/transactions.component').then((m) => m.TransactionsComponent)
            },
            {
                path: 'transaction/:id',
                canActivate: [canActivateAuth],
                loadComponent: () => import('../Pages/Profile/transactions/transaction-details/transaction-details.component').then(m => m.TransactionDetailsComponent)
            },
        ]
    },

    {
        path: 'create-event',
        canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
        loadComponent: () => import('../Pages/Profile/Events/create-events-page/create-events-page.component').then((m) => m.CreateEventsPageComponent)
    },
    
    {
        path:'create-track',
        canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
        loadComponent: () => import('../Pages/Profile/Tracks/create-track-page/create-track-page.component').then((m) => m.CreateTrackPageComponent)
    },
    {
        path:'confirm-phone',
        canActivate:[canActivateAuth],
        loadComponent: () => import('../Pages/Authorization/confirm-phone-page/confirm-phone-page.component').then((m) => m.ConfirmPhonePageComponent)
    },
    {
        path:'verification',
        canActivate:[canActivateAuth],
        loadComponent: () => import('../Pages/Authorization/confirm-email-page/confirm-email-page.component').then((m) => m.ConfirmEmailPageComponent)
    },
    

    {
        path:'create-comands',
        canActivate:[canActivateAuth,canActivateUserHaveRole([userRoles.couch,userRoles.organization, userRoles.rider],'тренера')],
        loadComponent: () => import('../Pages/Profile/comands/create-comand-page/create-comand-page.component').then((m) => m.CreateComandPageComponent)
    }, 
    {
        path:'edit-comands',
        canActivate:[canActivateAuth,canActivateUserHaveRole([userRoles.couch,userRoles.organization],'тренера')],
        loadComponent: () => import('../Pages/Profile/comands/edit-comand-page/edit-comand-page.component').then((m) => m.EditComandPageComponent)
    },  
    {
        path:'race/edit/:id',
        canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
        loadComponent: () => import('../Pages/Profile/Events/edit-event/edit-event.component').then((m) => m.EditEventComponent)
    },
    {
        path:'track/edit/:id',
        canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
        loadComponent: () => import('../Pages/Profile/Tracks/edit-track-page/edit-track-page.component').then((m) => m.EditTrackPageComponent)
    },
    {
        path:'command/edit/:id',
        canActivate:[canActivateAuth,canActivateUserHaveRole([userRoles.couch,userRoles.organization],'тренера')],
        loadComponent: () => import('../Pages/Profile/comands/edit-comand-page/edit-comand-page.component').then((m) => m.EditComandPageComponent)
    },
    {
        path:'command/edit/:id',
        canActivate:[canActivateAuth,canActivateUserHaveRole([userRoles.couch,userRoles.organization],'тренера')],
        loadComponent: () => import('../Pages/Profile/comands/edit-comand-page/edit-comand-page.component').then((m) => m.EditComandPageComponent)
    },
    {
                path:'application-for-race/:id',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/application-for-race/application-for-race.component').then((m) => m.ApplicationForRaceComponent)
    },
            {
                path:'my-events',
                canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
                loadComponent: () => import('../Pages/Profile/Events/my-events-page/my-events-page.component').then((m) => m.MyEventsPageComponent)
            },
            {
                path:'my-tracks',
                canActivate:[canActivateAuth,canActivateUserHaveRole(userRoles.organization,'организатора')],
                loadComponent: () => import('../Pages/Profile/Tracks/my-tracks-page/my-tracks-page.component').then((m) => m.MyTracksPageComponent)
            },
            {
                path:'my-comands',
                canActivate:[canActivateAuth],
                loadComponent: () => import('../Pages/Profile/comands/comands.component').then((m) => m.ComandsComponent)
            },
    {
        path:'aplication/:id',
        canActivate:[canActivateAuth],
        loadComponent: () => import('../Pages/Events/group-application/group-application.component').then((m) => m.GroupApplicationComponent)
    },
 
];
