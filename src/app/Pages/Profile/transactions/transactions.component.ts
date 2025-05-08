import { Component, OnInit, inject } from '@angular/core';
import { TransactionService } from 'src/app/Shared/Data/Services/Transaction/transaction.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonicModule } from '@ionic/angular';
import { ITransaction } from 'src/app/Shared/Data/Interfaces/transaction';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderModule, IonicModule, RouterModule]
})
export class TransactionsComponent implements OnInit {
  private transactionsService = inject(TransactionService);
  private loadingService = inject(LoadingService);
  
  transactions: ITransaction[] = [];

  constructor() { }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
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

  calculateTotalCost(transaction: ITransaction): number {
    if (!transaction.attendances) return 0;
    return transaction.attendances.reduce((total, service) => {
      return Number(total) + Number(service.price || 0);
    }, 0);
  }
}
