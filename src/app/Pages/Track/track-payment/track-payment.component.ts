import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { TransactionsService } from '@app/Shared/Data/Services/transactions.service';
import { Browser } from '@capacitor/browser';
import { finalize, Subject, takeUntil } from 'rxjs';
// import { Browser } from '@capacitor/browser';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-track-payment',
  templateUrl: './track-payment.component.html',
  styleUrls: ['./track-payment.component.scss'],
  imports:[CommonModule]
})
export class TrackPaymentComponent  implements OnInit {

  constructor() { }
  transactionService:TransactionsService = inject(TransactionsService)
  loadingService: LoadingService = inject(LoadingService)
  transactionId!:number
  paymentLink:any = ''
  transactionPrice:string = ''
  sanitizer:DomSanitizer = inject(DomSanitizer)
  private readonly destroy$ = new Subject<void>()
  @ViewChild('frame') iframe!: ElementRef<HTMLIFrameElement>;
  
  activeRoute:ActivatedRoute = inject(ActivatedRoute)
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
      console.log(res.payment_link)
      this.paymentLink = res.payment_link
      const openCapacitorSite = async () => {
        await Browser.open({ url: res.payment_link });
      };
      openCapacitorSite()
    })
  }
  ionViewWillEnter(){
       this.activeRoute.params.pipe(takeUntil(this.destroy$)).pipe(
         finalize(()=>{
         })).subscribe((params)=>{
          this.transactionId = params['id']
          this.transactionPrice = params['price']
         })
  }
  onIframeLoad() {
  
    
  
  }
  ionViewDidLeave(){
    this.paymentLink = ''
  }
  ngOnInit() {
   
  }

}
