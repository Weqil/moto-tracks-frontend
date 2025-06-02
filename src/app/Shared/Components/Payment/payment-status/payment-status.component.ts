import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss'],
  imports:[CommonModule]
})
export class PaymentStatusComponent  implements OnInit {
 @Input() status: 'load'|'success'|'error'|'sleep'|'warning' = 'sleep'
 load:boolean = false
 @Output() checkPaymentEmit:EventEmitter<any> = new EventEmitter()
 ngOnChanges(changes: SimpleChanges): void {
  if (this.status === 'load') {
    this.checkPayment();
  }
 }

  constructor() { }

  checkPayment() {
    if (this.status !== 'load') {
      return;
    }
    this.checkPaymentEmit.emit()
    setTimeout(() => {
      this.checkPayment(); 
    }, 3000);
  }

  ngOnInit() {}

}
