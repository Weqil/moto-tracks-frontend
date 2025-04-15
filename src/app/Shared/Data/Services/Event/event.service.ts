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
  
  getAllEvents(params?:{userId?:string,appointmentUser?:number, dateStart?:string, dateEnd?:string,locationId?:string[], sortField?:string, sort?:string, commissionUser?:number,userIdExists?:number|string}){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`, {params:{...params}})
  }

  generateGoogleLink(id:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${id}/appointment-race/users-table`)
  }

  getEventById(eventId:string,params?:{userId?:string,appointmentUser?:number, dateStart?:string}){
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

  updateEvent(editForm:any, eventId:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${eventId}/update`, editForm)
  }

  createEvent(event:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races`, event)
  }
  toggleAplicationInRace(raceId:string,data:any){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${raceId}/toggle-appointment-race`, data)
  }

  
}
