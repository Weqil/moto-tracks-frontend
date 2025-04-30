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
  

  getTracks(params?:{locationId?:string[],name?:string}){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks`, {params:{...params}})
  }

  getTrackById(id:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks/${id}`)
  }

  getTracksByUserId(userId:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks`,{params:{userId:userId}})
  }
  createTrack(trackForm:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks`, trackForm)
  }
  loginUser( loginForm:FormData){
    return this.http.post<Login>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/login`, loginForm)
  }
  updateTrack(editTrack:any, trackId:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/tracks/${trackId}`, editTrack)
  }
 
}
