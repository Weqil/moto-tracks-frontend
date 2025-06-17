import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);

  getTransactions(params: any = {}): Observable<any> {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions`, { params });
  }

  getTransactionsForTrack(id:number, params: any = {} ){
     return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/track/${id}/transactions`, { params });
  }

  getTransactionsForId(id: number): Observable<any> {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions/${id}`);
  }
}
