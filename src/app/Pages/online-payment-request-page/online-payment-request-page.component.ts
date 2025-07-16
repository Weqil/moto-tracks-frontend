import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component'
import { StandartRichInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component'
import { IonContent } from '@ionic/angular/standalone'

@Component({
  selector: 'app-online-payment-request-page',
  templateUrl: './online-payment-request-page.component.html',
  styleUrls: ['./online-payment-request-page.component.scss'],
  imports: [IonContent, HeaderComponent, StandartInputComponent, StandartRichInputComponent, IconButtonComponent],
})
export class OnlinePaymentRequestPageComponent implements OnInit {
  constructor() {}
  onlinePaymentForm = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    topic: new FormControl('Обращение по подключению онлайн оплаты'),
    message: new FormControl('', [Validators.required, Validators.minLength(20)]),
  })
  ngOnInit() {}
}
