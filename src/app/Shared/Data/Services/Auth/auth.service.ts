import { inject, Injectable } from '@angular/core';
import { UserService } from '../User/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userService:UserService = inject(UserService)

  public token: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(this.getAuthTokenFromLocalStorage())
  
  public authenticationState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() { }

  isAuthenticated(): boolean {
    let user = this.userService.getUserFromLocalStorage()
    if (this.token && user) {
      this.authenticationState.value === false ? this.authenticationState.next(true) : null
      return true
    } else {
      this.authenticationState.value === true ? this.authenticationState.next(false) : null
      return false
    }
  }

  setAuthTokenInLocalStorage(token:string){
    localStorage.setItem('token', token);
  }
  getAuthTokenFromLocalStorage(){
    return localStorage.getItem('token');
  }

}
