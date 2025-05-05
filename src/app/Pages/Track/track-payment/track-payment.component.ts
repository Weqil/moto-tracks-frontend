import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TransactionsService } from '@app/Shared/Data/Services/transactions.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Browser } from '@capacitor/browser';
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
  createTransaction(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.transactionService.createTransactions(this.transactionId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      // this.paymentLink = this.sanitizer.bypassSecurityTrustResourceUrl(res.payment_link)
      Browser.open({ url:res.payment_link });
      console.log(res)
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
