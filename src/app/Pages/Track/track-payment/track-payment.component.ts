import { Component, inject, OnInit } from '@angular/core';
import { TransactionsService } from '@app/Shared/Data/Services/transactions.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-track-payment',
  templateUrl: './track-payment.component.html',
  styleUrls: ['./track-payment.component.scss'],
})
export class TrackPaymentComponent  implements OnInit {

  constructor() { }
  transactionService:TransactionsService = inject(TransactionsService)
   loadingService: LoadingService = inject(LoadingService)
  createTransaction(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.transactionService.createTransactions().pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      window.location.href = res.payment_link
    })
  }
  ngOnInit() {}

}
