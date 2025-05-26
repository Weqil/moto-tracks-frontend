import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { TransactionsService } from '@app/Shared/Data/Services/transactions.service';
import { Browser } from '@capacitor/browser';
import { finalize, Subject, takeUntil } from 'rxjs';
// import { Browser } from '@capacitor/browser';
import { ActivatedRoute } from '@angular/router';
import { IonCheckbox, IonLabel, IonModal, NavController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentStatusComponent } from '@app/Shared/Components/Payment/payment-status/payment-status.component';
import { SharedModule } from '@app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-track-payment',
  templateUrl: './track-payment.component.html',
  styleUrls: ['./track-payment.component.scss'],
  imports:[CommonModule,PaymentStatusComponent,SharedModule,HeaderComponent]
})
export class TrackPaymentComponent  implements OnInit {

  constructor() {
    App.addListener('resume', () => { 
     if(this.transactionId){
      
     }
    });

    App.addListener('pause', () => { 
     
    });
   }
  transactionService:TransactionsService = inject(TransactionsService)
  loadingService: LoadingService = inject(LoadingService)
  transactionId!:number
  paymentLink:any = ''
  paymentStatus: 'load'|'success'|'error'|'sleep' = 'sleep'
  transactionPrice:string = ''
  testCount:number = 0
  navController: NavController = inject(NavController)
  createTransactionId!:number
  sanitizer:DomSanitizer = inject(DomSanitizer)
  private readonly destroy$ = new Subject<void>()
  @ViewChild('frame') iframe!: ElementRef<HTMLIFrameElement>;
  
  activeRoute:ActivatedRoute = inject(ActivatedRoute)

  



  setPaymentStatus(value:'load'|'success'|'error'|'sleep'){
    this.paymentStatus = value
  }

  async createTransaction(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.transactionService.createTransactions(this.transactionId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe(async (res:any)=>{
      console.log(res)
      this.paymentLink = res.payment_link
      this.createTransactionId = res.transaction.id
      const openCapacitorSite = async () => {
        await Browser.open({ url: res.payment_link });
      };
      this.transactionService.startCheckTimer(this.createTransactionId)
      openCapacitorSite()
     
    })
  }
  ionViewWillEnter(){
    this.transactionService.stopCheckTimer()
    this.activeRoute.params.pipe(takeUntil(this.destroy$)).pipe(
         finalize(()=>{
    })).subscribe((params)=>{
          this.transactionId = params['id']
          this.transactionPrice = params['price']
    })
  }
  onIframeLoad() {
  
  }

  back(){
    this.navController.back()
    this.transactionService.stopCheckTimer()
    this.paymentStatus = 'sleep'
    this.paymentLink = ''
  }

  ionViewDidLeave(){
    if(this.paymentStatus == 'success'){
       const closeCapacitorSite = async () => {
        await Browser.close()
      };
      closeCapacitorSite()
    }
    this.paymentLink = ''
    if(this.paymentStatus == 'success' || this.paymentStatus == 'error' ){
      this.transactionService.stopCheckTimer()
      this.paymentStatus = 'sleep'
      this.paymentLink = ''
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
