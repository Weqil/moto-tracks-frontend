import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {

  constructor() { }
  http:HttpClient = inject(HttpClient)

    sendRecoveryLink(form:any){
      return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/recovery-password/send`, form)
  }
  recoveryPassword(form:any){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/recovery-password/recovery`, form)
  }
}
