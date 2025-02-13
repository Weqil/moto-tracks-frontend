import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../../Interfaces/login-model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  http:HttpClient = inject(HttpClient)

  userService:UserService = inject(UserService)



  loginUser( registerForm:FormData){
    return this.http.post<Login>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/login`, registerForm)
  }

  getCodeInEmailConfirm(){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/verification-email/send`,{})
  }

  submitCodeInEmail(code:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/verification-email/verify`,{code:Number(code)})
  }
 
}
