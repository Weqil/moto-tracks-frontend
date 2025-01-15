import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
  loginUser( loginForm:{name:string, password:string}){
    return this.http.get<string>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/sanctum/csrf-cookie`)
  }
}
