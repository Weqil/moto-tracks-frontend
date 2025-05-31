import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor() { }
  http:HttpClient = inject(HttpClient)

  status: 'load'|'success'|'error'|'sleep' = 'sleep'
  currentStatus:BehaviorSubject<string> = new BehaviorSubject('sleep')
  private timer?: ReturnType<typeof setTimeout>;
  startCheckTimer(tranasctionId:number) {
    if (this.status === 'load') return; // уже работает
    this.status = 'load';
    this.currentStatus.next(this.status)
    this.checkLoop(tranasctionId);
  }
  private checkLoop(tranasctionId:number) {
    if (this.status !== 'load') return;
    this.getTransactionForId(tranasctionId).pipe().subscribe((res:any)=>{
      if(res.transaction.status !== null){
        this.status = res.transaction.status ? 'success':'error'
         const closeCapacitorSite = async () => {
          await Browser.close()
        };
        closeCapacitorSite()
         this.currentStatus.next(this.status)
        if (this.timer) clearTimeout(this.timer);
      }
    })

    this.timer = setTimeout(() => {
      this.checkLoop(tranasctionId);
    }, 3000);
  }

  stopCheckTimer() {
    this.status = 'sleep';
    if (this.timer) clearTimeout(this.timer);
  }

  getTransactionForId(id:number){
     return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions/${id}`)
  }

  createTransactions(id?:number,paramas?:any){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/transactions`, {attendanceIds:[
      id
    ],...paramas})
  }
}