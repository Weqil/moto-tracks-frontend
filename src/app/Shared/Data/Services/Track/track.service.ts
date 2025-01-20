import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../../Interfaces/login-model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor() { }

  http:HttpClient = inject(HttpClient)
  

  getTracks(){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks`)
  }



  loginUser( loginForm:FormData){
    return this.http.post<Login>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/login`, loginForm)
  }

 
}
