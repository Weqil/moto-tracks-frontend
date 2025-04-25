import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
  createTransactions(id?:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions`, {attendanceIds:[
      1
    ]})
  }
}
