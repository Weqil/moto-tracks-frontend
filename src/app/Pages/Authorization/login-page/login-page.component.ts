import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { LoginService } from 'src/app/Shared/Data/Services/Auth/login.service';
import { Login } from 'src/app/Shared/Data/Interfaces/login-model';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [SharedModule, HeaderModule, StandartInputComponent],
})
export class LoginPageComponent  implements OnInit {

  constructor() { }
  loading:LoadingService = inject(LoadingService)
  loginService: LoginService = inject(LoginService)
  userService: UserService = inject(UserService)
  authService: AuthService = inject(AuthService)
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
    const fd:FormData = new FormData()
    fd.append('name', this.loginForm.get('name')?.value)
    fd.append('password', this.loginForm.get('password')?.value)
    this.loading.showLoading()
    this.loginService.loginUser(fd).pipe(
      finalize(()=>{
        this.loading.hideLoading()
      })
    ).subscribe((res:Login)=>{
      this.userService.setUserInLocalStorage(res.user)
      this.authService.setAuthTokenInLocalStorage(String(res.access_token))
    })
   
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

}
