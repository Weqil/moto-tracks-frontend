import { ToastService } from './../../Shared/Services/toast.service'
import { Component, inject, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component'
import { StandartRichInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component'
import { PaymentRequestService } from '@app/Shared/Data/Services/payment-request.service'
import { InputErrorService } from '@app/Shared/Services/input-error.service'
import { LoadingService } from '@app/Shared/Services/loading.service'
import { IonContent } from '@ionic/angular/standalone'
import { finalize } from 'rxjs'

@Component({
  selector: 'app-online-payment-request-page',
  templateUrl: './online-payment-request-page.component.html',
  styleUrls: ['./online-payment-request-page.component.scss'],
  imports: [IonContent, HeaderComponent, StandartInputComponent, StandartRichInputComponent, IconButtonComponent, ReactiveFormsModule],
})
export class OnlinePaymentRequestPageComponent implements OnInit {
  constructor() {}
  paymentRequestService: PaymentRequestService = inject(PaymentRequestService)
  onlinePaymentForm = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    topic: new FormControl('Обращение по подключению онлайн оплаты'),
    message: new FormControl('', [Validators.required, Validators.minLength(20)]),
  })
  inputErrorService: InputErrorService = inject(InputErrorService)
  toastService: ToastService = inject(ToastService)
  loaderService: LoadingService = inject(LoadingService)
  checkInputInControl(control: AbstractControl | null): { invalid: boolean; message: string } {
    if (control) {
      return this.inputErrorService.checkInputInControl(control)
    } else {
      return {
        invalid: true,
        message: 'control dont create',
      }
    }
  }
  submitForm() {
    this.onlinePaymentForm.markAllAsTouched()
    if (this.onlinePaymentForm.valid) {
      this.loaderService.showLoading().then((loader: HTMLIonLoadingElement) => {
        this.paymentRequestService
          .submitReauestInOnlinePayment(this.onlinePaymentForm.value)
          .pipe(
            finalize(() => {
              this.loaderService.hideLoading(loader)
              this.onlinePaymentForm.reset()
            }),
          )
          .subscribe(() => {
            this.toastService.showToast('Заявка успешно отправлена', 'success')
          })
      })
    }
  }
  ngOnInit() {}
}
