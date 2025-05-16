import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Degree } from '../Interfaces/degree-model';
@Injectable({
  providedIn: 'root'
})
export class CupService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
  allDegree:Degree[] = []
  getAllDegree(){
      return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/degree`)
  }
}
