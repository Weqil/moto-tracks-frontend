import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITransaction } from '@app/Shared/Data/Interfaces/transaction';
import { TransactionService } from '@app/Shared/Data/Services/Transaction/transaction.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent  implements OnInit {

  constructor() { }
  private readonly destroy$ = new Subject<void>()
   private transactionsService = inject(TransactionService);
  private loadingService = inject(LoadingService);
  trackId!: string
  transactions: ITransaction[] = [];
  route: ActivatedRoute = inject(ActivatedRoute)
  
  getTransactions(){
        this.loadingService.showLoading();
        this.transactionsService.getTransactions()
          .pipe(
            finalize(() => this.loadingService.hideLoading())
          )
          .subscribe({
            next: (response: any) => {
              console.log(response)
              this.transactions = response.transactions;
            },
            error: (error) => {
              console.error('Ошибка при загрузке транзакций:', error);
            }
          });
  }

  ionViewWillEnter(){
     this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
     this.trackId = params['id']

    })
  }

  ngOnInit() {}

}
