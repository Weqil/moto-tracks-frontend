import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
  getAllEvents(){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`)
  }

  getEventById(eventId:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${eventId}`)
  }
  getEventByUserId(userId:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`,{params: {userId:userId }})
  }

  createEvent(event:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`, event)
  }
}
