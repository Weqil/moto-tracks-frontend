import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
  createTransactions(id?:number){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions`, {attendanceIds:[
      id
    ]})
  }
}
