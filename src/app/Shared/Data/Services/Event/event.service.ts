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
}
