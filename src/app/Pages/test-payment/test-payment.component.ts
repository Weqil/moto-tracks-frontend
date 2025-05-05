import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StandartButtonComponent } from '@app/Shared/Components/UI/Buttons/standart-button/standart-button.component';

@Component({
  selector: 'app-test-payment',
  templateUrl: './test-payment.component.html',
  styleUrls: ['./test-payment.component.scss'],
  imports:[StandartButtonComponent,RouterLink]
})
export class TestPaymentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
