import { query } from '@angular/animations';
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

  generateGoogleLink(id:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${id}/appointment-race/users-table`)
  }

  getEventById(eventId:string,params?:{userId?:string,appointmentUser?:number}){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${eventId}`,{
      params:{...params}
    })
  }
  getEventByUserId(userId:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`,{params: {userId:userId }})
  }
  getUsersInRace(raceId:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${raceId}/appointment-race/users`,)
  }

  createEvent(event:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`, event)
  }
  toggleAplicationInRace(raceId:string,data:any){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${raceId}/toggle-appointment-race`, data)
  }
}
