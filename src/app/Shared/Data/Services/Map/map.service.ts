import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
 
  getAllRegions(){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/locations`,)
  }
}
