import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  http:HttpClient = inject(HttpClient)
  constructor() { }
  getLastVersion(){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/version-first`)
  }
}
