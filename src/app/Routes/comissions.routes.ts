import { Routes } from '@angular/router'
import { userRoles } from '@app/Shared/Data/Enums/roles'
import { canActivateAuth } from '@app/Shared/Guards/Auth/auth.guard'
import { canActivateUserHaveRole } from '@app/Shared/Guards/Auth/role.guard'

export const comissionsRoutes: Routes = [
  {
    path: 'application-for-race/:id',
    canActivate: [canActivateAuth, canActivateUserHaveRole([userRoles.commission], 'Эта страница доступна только членам комиссии')],
    loadComponent: () => import('../Pages/application-for-race/application-for-race.component').then((m) => m.ApplicationForRaceComponent),
  },
  {
    path: 'select-result-race/:id',
    canActivate: [canActivateAuth, canActivateUserHaveRole([userRoles.commission], 'Эта страница доступна только членам комиссии')],
    loadComponent: () => import('../Pages/Events/Results/select-results-page/select-result-page.component').then((m) => m.CreateResultPageComponent),
  },
  {
    path: 'create-result-race/:id',
    canActivate: [canActivateAuth, canActivateUserHaveRole([userRoles.commission], 'Эта страница доступна только членам комиссии')],
    loadComponent: () => import('../Pages/Events/Results/create-results-page/create-results-page.component').then((m) => m.CreateResultsPageComponent),
  },
]
