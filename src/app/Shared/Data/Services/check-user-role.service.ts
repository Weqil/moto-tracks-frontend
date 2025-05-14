import { inject, Injectable } from '@angular/core';
import { User } from '../Interfaces/user-model';
import { UserService } from './User/user.service';
import { userRoles } from '../Enums/roles';
import { UserStatuses,translitUserStatuses } from 'src/app/Shared/Enums/user-status';
@Injectable({
  providedIn: 'root'
})
export class CheckUserRoleService {

  constructor() { }

  user: User | null = inject(UserService).user.value

  userHaveRole(roles:string[]): boolean {
    return this.user ? this.user?.roles?.some((role:any) => roles.includes(role.name)) ?? false : false
  }

  getUserRoleNamesInTranslit(user: User) {
    if (user.roles && user.roles.length) {
        return user.roles.map((role) => translitUserStatuses[role.name as keyof typeof translitUserStatuses] || '');
    }
    return ['Болельщик'];
  }

  searchLastRole(user?: User) {
    if(!user){
      let rolesRank = [
        { index: 1, name: [UserStatuses.rider] },
        { index: 2, name: [UserStatuses.couch] },
        { index: 3, name: [UserStatuses.organizer] },
        { index: 4, name: [UserStatuses.administrator] },
        { index: 5, name: [UserStatuses.root] },
        { index: 6, name: [UserStatuses.commission] },
      ];
  
      let userRoles: any[] = this.user?.roles.filter((role: any) => role) || [];
  
      let matchedRoles = rolesRank.filter(rank => 
        userRoles.some(userRole => rank.name.includes(userRole.name))
      );
  
      let highestRole = matchedRoles.sort((a, b) => b.index - a.index)[0]; // сортируем по убыванию
  
        return this.user?.roles.find((role:any)=> role.name == highestRole.name)
      }else{
        let rolesRank = [
          { index: 1, name: [UserStatuses.rider] },
          { index: 2, name: [UserStatuses.couch] },
          { index: 3, name: [UserStatuses.organizer] },
          { index: 4, name: [UserStatuses.administrator] },
          { index: 5, name: [UserStatuses.root] },
          { index: 6, name: [UserStatuses.commission] },
        ];
    
        let userRoles: any[] = user?.roles.filter((role: any) => role) || [];
    
        let matchedRoles = rolesRank.filter(rank => 
          userRoles.some(userRole => rank.name.includes(userRole.name))
        );
    
        let highestRole = matchedRoles.sort((a, b) => b.index - a.index)[0]; // сортируем по убыванию
    
        return user?.roles.find((role:any)=> role.name == highestRole.name)
      }
    }
      
}
