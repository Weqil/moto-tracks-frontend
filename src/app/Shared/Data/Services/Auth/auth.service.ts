import { inject, Injectable } from '@angular/core';
import { UserService } from '../User/user.service';
import { BehaviorSubject } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import { CapacitorCookies } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userService:UserService = inject(UserService)
  cookieService:CookieService = inject(CookieService)
  public token: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(this.getAuthToken())
  
  public authenticationState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() { }

  //Проверяю куку на токен и если его нет то не авторизован
  isAuthenticated(): boolean {
    if (!this.token.value) {
      this.token.next(this.getAuthToken())
    } 
    return !!this.token.value
  }

  setAuthToken(token:string){
    this.token.next(token)
    localStorage.setItem('authToken',token)
  }

  logout(){
    localStorage.removeItem('authToken')
    this.cookieService.delete('authToken')
    this.token.next(null)
    this.authenticationState.next(false)
    this.userService.clearUser()
  }

  getAuthToken(){
    return String(localStorage.getItem('authToken'))
  }

}
