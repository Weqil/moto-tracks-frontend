import { inject, Injectable } from '@angular/core'
import { User } from '../Interfaces/user-model'
import { UserService } from './User/user.service'
import { userRoles } from '../Enums/roles'
import { UserStatuses, translitUserStatuses } from 'src/app/Shared/Enums/user-status'
import { UserRole } from '../Interfaces/user-role.interface'
import { filter, from, map } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class CheckUserRoleService {
  constructor(private userService: UserService) {}
  rolesRank: UserRole[] = [
    { index: 1, name: [UserStatuses.rider], client: true },
    { index: 2, name: [UserStatuses.couch], client: true },
    { index: 3, name: [UserStatuses.organizer], client: true },
    { index: 4, name: [UserStatuses.administrator] },
    { index: 5, name: [UserStatuses.root] },
    { index: 6, name: [UserStatuses.commission] },
  ]

  userHaveRole(roles: string[], user?: User): boolean {
    let currentUser: User | null = this.userService.user.value

    if (user) return user ? (user?.roles?.some((role: any) => roles.includes(role.name)) ?? false) : false
    return currentUser ? (currentUser?.roles?.some((role: any) => roles.includes(role.name)) ?? false) : false
  }

  getUserRoleNamesInTranslit(user: User) {
    if (user.roles && user.roles.length) {
      return user.roles.map((role) => translitUserStatuses[role.name as keyof typeof translitUserStatuses] || '')
    }
    return ['Болельщик']
  }

  getTranslitRole(roleName: string) {
    return translitUserStatuses[roleName as keyof typeof translitUserStatuses] || ''
  }

  userCanAddNewRole() {
    return this.rolesRank.filter((role: UserRole) => !!role.client && !this.userHaveRole(role.name))
  }

  searchLastRole(user?: User) {
    let currentUser: User | null = this.userService.user.value

    if (!user) {
      let userRoles: any[] = currentUser?.roles.filter((role: any) => role) || []

      let matchedRoles = this.rolesRank.filter((rank) => userRoles.some((userRole) => rank.name.includes(userRole.name)))

      let highestRole = matchedRoles.sort((a, b) => b.index - a.index)[0] // сортируем по убыванию

      return currentUser?.roles.find((role: any) => role.name == highestRole.name)
    } else {
      let userRoles: any[] = user?.roles.filter((role: any) => role) || []

      let matchedRoles = this.rolesRank.filter((rank) => userRoles.some((userRole) => rank.name.includes(userRole.name)))

      let highestRole = matchedRoles.sort((a, b) => b.index - a.index)[0] // сортируем по убыванию

      return user?.roles.find((role: any) => role.name == highestRole.name)
    }
  }
}
