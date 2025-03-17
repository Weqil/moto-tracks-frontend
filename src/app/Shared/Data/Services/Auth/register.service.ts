import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../../Interfaces/login-model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly http:HttpClient = inject(HttpClient)


  constructor() { }

  registerUser( registerForm:FormData){
      return this.http.post<Login>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/register`, registerForm)
  }
  registerUserInPhone(form:any){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/phone/register`, form)
  }
}
