import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [SharedModule, HeaderModule, StandartInputComponent],
})
export class LoginPageComponent  implements OnInit {

  constructor() { }
  loginForm!: FormGroup
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
    if (this.loginForm.get('name')?.errors) {
      this.loginInvalid.localError = true
      this.loginInvalid.name.status = true
      this.loginInvalid.name.message = this.loginForm.get('name')?.hasError('required')
        ? 'Поле не может быть пустым'
        : 'E-mail должен быть не менее 3 символов'
    } else {
      this.loginInvalid.name.status = false
      this.loginInvalid.name.message = ''
    }

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

  submitLoginForm(){
    console.log('отправить форму')
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

}
