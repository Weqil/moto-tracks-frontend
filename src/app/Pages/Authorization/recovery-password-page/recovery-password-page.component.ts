import { Component, OnInit } from '@angular/core';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from "../../../Shared/Components/UI/header/header.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recovery-password-page',
  templateUrl: './recovery-password-page.component.html',
  styleUrls: ['./recovery-password-page.component.scss'],
  imports: [SharedModule, HeaderComponent, StandartInputComponent,IonModal],
})
export class RecoveryPasswordPageComponent  implements OnInit {

  constructor() { }

  loginForm:FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  errorText:any
  loginInvalid = {
    localError: false,
    serverError: false,
    name: {
      status: false,
      message: '',
    },
    password: {
      status: false,
      message: '',
    },
  }
  validateForm() {
    this.loginInvalid.localError = false
    if (this.loginForm.get('password')?.errors) {
      this.loginInvalid.localError = true
      this.loginInvalid.password.status = true
      this.loginInvalid.password.message = this.loginForm.get('password')?.hasError('required')
        ? 'Поле не может быть пустым'
        : 'Пароль должен быть не менее 8 символов'
    } else {
      this.loginInvalid.password.status = false
      this.loginInvalid.password.message = ''
    }
  }

  clearErrors() {
    if (this.loginInvalid.localError || this.loginInvalid.serverError) {
      this.validateForm()
    }
  }

  


  ngOnInit() {
    
  }

}
