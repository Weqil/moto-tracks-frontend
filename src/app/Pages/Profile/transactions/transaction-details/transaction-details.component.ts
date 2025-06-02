import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/Shared/Data/Services/Transaction/transaction.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonicModule } from '@ionic/angular';
import { ITransaction } from 'src/app/Shared/Data/Interfaces/transaction';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderModule, IonicModule, RouterModule]
})
export class TransactionDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private transactionsService = inject(TransactionService);
  private loadingService = inject(LoadingService);
  
  transaction: ITransaction | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTransaction(Number(id));
    }
  }

  loadTransaction(id: number) {
    this.loadingService.showLoading();
    this.transactionsService.getTransactionsForId(id)
      .pipe(
        finalize(() => this.loadingService.hideLoading())
      )
      .subscribe({
        next: (response: any) => {
          this.transaction = response.transaction;
        },
        error: (error: any) => {
          console.error('Ошибка при загрузке транзакции:', error);
        }
      });
  }

  getBackUrlForImg(path: string) {
    return environment.BACKEND_URL+":"+environment.BACKEND_PORT+"/storage/"+path
  }

  calculateTotalCost(): number {
    if (!this.transaction?.attendances) return 0;
    return this.transaction.attendances.reduce((total, attendee) => {
      return Number(total) + Number((attendee.price || 0));
    }, 0);
  }
} 