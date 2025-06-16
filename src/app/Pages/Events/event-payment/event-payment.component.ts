import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentStatusComponent } from '@app/Shared/Components/Payment/payment-status/payment-status.component';
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component';
import { TransactionsService } from '@app/Shared/Data/Services/transactions.service';
import { SharedModule } from '@app/Shared/Modules/shared/shared.module';
import { Browser } from '@capacitor/browser';
import { IonContent } from "@ionic/angular/standalone";
import { IonCheckbox, IonLabel, IonModal, NavController } from '@ionic/angular/standalone';
import { finalize, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-event-payment',
  templateUrl: './event-payment.component.html',
  styleUrls: ['./event-payment.component.scss'],
  imports:[SharedModule,HeaderComponent,PaymentStatusComponent]
})

export class EventPaymentComponent  implements OnInit {

  constructor() { }
  paymentStatus: 'load'|'success'|'error'|'sleep' = 'sleep'
  navController: NavController = inject(NavController)
  transactionService:TransactionsService = inject(TransactionsService)
  transactionId!:number
  activeRoute:ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  back(){
    this.navController.back()
    this.transactionService.stopCheckTimer()
    this.paymentStatus = 'sleep'
  }
  ionViewWillEnter(){
    this.activeRoute.params.pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{ })).subscribe((params)=>{
        this.transactionId = params['id']
        this.transactionService.startCheckTimer(this.transactionId)
    })
  }
  ionViewDidLeave(){
    if(this.paymentStatus == 'success'){
       const closeCapacitorSite = async () => {
        await Browser.close()
      };
      closeCapacitorSite()
    }
    this.transactionService.stopCheckTimer()
    if(this.paymentStatus == 'success' || this.paymentStatus == 'error' ){
      this.transactionService.stopCheckTimer()
      this.paymentStatus = 'sleep'
    }
  }
  ngOnInit() {
    this.transactionService.currentStatus.subscribe((res:any)=>{
    this.paymentStatus = res
    if(this.paymentStatus == 'success'){
       const closeCapacitorSite = async () => {
        await Browser.close()
      };
      closeCapacitorSite()
    }
   })
  }

}
