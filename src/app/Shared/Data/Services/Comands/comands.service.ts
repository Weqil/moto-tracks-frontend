import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComandsService {

  constructor() { }

  http:HttpClient = inject(HttpClient)

  createComand(formdata:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`, formdata)
  }
  editComand(formdata:FormData, eventId:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${eventId}`, formdata)
  }

  getComands(params?:{userId?:number}){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`,{params:{...params}})
  }

  getCommandById(id:number){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${id}`)
  }
  getMembersForUsers(id: number) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${id}/members`)
  }

  getCoachesForUsers() {}
}
