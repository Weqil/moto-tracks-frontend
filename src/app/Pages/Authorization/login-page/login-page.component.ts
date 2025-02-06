import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { LoginService } from 'src/app/Shared/Data/Services/Auth/login.service';
import { Login } from 'src/app/Shared/Data/Interfaces/login-model';
import { catchError, EMPTY, empty, finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NavController } from '@ionic/angular/standalone';
import { MessagesErrors } from 'src/app/Shared/Enums/messages-errors';

import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { AuthErrosMessages } from 'src/app/Shared/Data/Enums/erros';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [SharedModule, HeaderModule, StandartInputComponent,ButtonsModule],
})
export class LoginPageComponent  implements OnInit {

  constructor() { }
  loading:LoadingService = inject(LoadingService)
  loginService: LoginService = inject(LoginService)
  userService: UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  router:Router = inject(Router)
  navController: NavController = inject(NavController)
  authService: AuthService = inject(AuthService)
  loginForm!: FormGroup
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
    if (this.loginForm.get('name')?.errors) {
      this.loginInvalid.localError = true
      this.loginInvalid.name.status = true
      if( this.loginForm.get('name')?.hasError('required')){
        this.loginInvalid.name.message = 'Поле не может быть пустым'
      }
      else if(this.loginForm.get('name')?.hasError('minLength')){
        this.loginInvalid.name.message = 'E-mail должен быть не менее 3 символов'
      } else{
        this.loginInvalid.name.message = 'E-mail некоректный'
      }
  
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

  errorResponseAfterLogin(err: any) {
    let message = err.error.message
  
    // this.toastService.showToast(err.error.message || MessagesErrors.default, 'warning')
    this.loginInvalid.serverError = true
    if (message === AuthErrosMessages.emailNotCorrected) {
      this.loginInvalid.name.status = true
      this.loginInvalid.name.message = 'Введите корректный E-mail'
    }
    if (message === AuthErrosMessages.lateAuthorization || err.status == '403') {
      this.loginInvalid.name.status = true
      this.loginInvalid.password.status = true
      this.loginInvalid.password.message = 'Почта или пароль не верный'
    }
 
    if(err.status == '422' && message ==  AuthErrosMessages.emailNotFound){
      this.loginInvalid.name.status = true
      this.loginInvalid.password.status = true
      this.loginInvalid.password.message = 'Такого аккаунта не существует'
    }
    this.loginForm.enable()
  }

  clearErrors() {
    if (this.loginInvalid.localError || this.loginInvalid.serverError) {
      this.validateForm()
    }
  }

  submitLoginForm(){
    //Проверяб форму на валидность что бы вывести ошибки 
    this.validateForm()
    if (!this.loginInvalid.localError) {
      const fd:FormData = new FormData()
      fd.append('email', this.loginForm.get('name')?.value)
      fd.append('password', this.loginForm.get('password')?.value)
      this.loading.showLoading()
      this.loginService.loginUser(fd).pipe(
        catchError((err: serverError) => {
          this.errorResponseAfterLogin(err)
          this.errorText = err
          return EMPTY
        }),
        
        finalize(()=>{
          this.loading.hideLoading()
        })
      ).subscribe((res:Login)=>{

        this.userService.setUserInLocalStorage(res.user)
        this.authService.setAuthToken(String(res.access_token))
        setTimeout(()=>{
          this.navController.navigateForward(['/cabinet'])
        },100)

      })
    }
   
   
  }

  redirectInRegistration(){
    this.navController.navigateForward('/registration', {animationDirection: 'forward'})
  }
  
  ngOnInit() {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

} 
