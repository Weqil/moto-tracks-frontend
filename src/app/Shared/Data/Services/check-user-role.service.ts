import { inject, Injectable } from '@angular/core';
import { User } from '../Interfaces/user-model';
import { UserService } from './User/user.service';

@Injectable({
  providedIn: 'root'
})
export class CheckUserRoleService {

  constructor() { }

  user: User | null = inject(UserService).user.value

  userHaveRole(roles:string[]): boolean {
    return this.user ? this.user?.roles?.some((role:any) => roles.includes(role.name)) ?? false : false
  }
}
