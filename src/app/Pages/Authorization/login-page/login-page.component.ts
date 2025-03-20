import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { LoginService } from 'src/app/Shared/Data/Services/Auth/login.service';
import { Login } from 'src/app/Shared/Data/Interfaces/login-model';
import { catchError, EMPTY, empty, finalize, throwError } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { MessagesErrors } from 'src/app/Shared/Enums/messages-errors';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { AuthErrosMessages } from 'src/app/Shared/Data/Enums/erros';
import moment from 'moment';
import { RecoveryPasswordService } from 'src/app/Shared/Data/Services/Auth/recovery-password.service';
import { environment } from 'src/environments/environment';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  imports: [SharedModule, HeaderModule, StandartInputComponent,IonModal,NzSegmentedModule,NgxOtpInputComponent],
})
export class LoginPageComponent  implements OnInit {

  constructor() { }

  loading:LoadingService = inject(LoadingService)
  loginService: LoginService = inject(LoginService)

  userService: UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  emailLoginModalValue: boolean = false;
  router:Router = inject(Router)
  navController: NavController = inject(NavController)
  phoneLoginModalValue: boolean = false; 
  authService: AuthService = inject(AuthService)
  recoveryPasswordService: RecoveryPasswordService = inject(RecoveryPasswordService)
  loginTypeOptions = ['Телефон', 'Почта'];
  selectedLoginTypeValue = 'Телефон';
  formmatedPhone:string = ''
  codeValue:string = ''
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
  
  timer: any
  timerReady: boolean = true
  seconds: number = 60
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength:4,
  }
  recoveryForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    url: new FormControl(`${environment.BASE_URL}/recovery-password`,)
  })

  phoneForm: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required,Validators.minLength(11)])
  })

  openEmailModal(){
    this.emailLoginModalValue = true;
  }

  closeEmailModal(){
    this.emailLoginModalValue = false;
  }


  validateRecovery() {
    this.timerReady = false
    this.timer = setInterval(() => {
      if (this.seconds != 0 && !this.timerReady) {
        this.seconds--
      } else {
        clearInterval(this.timer)
        this.seconds = 60
        this.timerReady = true
      }
    }, 1000)
  }

  sendTokenInEmail(){
    this.recoveryPasswordService.sendRecoveryLink(this.recoveryForm.value).pipe().subscribe((res:any)=>{
    })
    
  }

  changeLoginType(value: string): void {
    this.selectedLoginTypeValue = value;
  }

  submitRecovery() {
    this.validateRecovery()
   
    if( !this.recoveryForm.invalid || this.timerReady){
      this.sendTokenInEmail()
    }

    this.toastService.showToast('Ссылка на востановление пароля отправлена вам на почту',"success")
  }

  changeCode(code:any){
    this.codeValue = code.join('')
    if(this.codeValue.length === 4){
      this.sendLoginCode()
    }
  }

  sendLoginCode(){

    let loader:HTMLIonLoadingElement
    this.loading.showLoading().then((res)=>loader = res)
    this.loginService.submitPhoneCodeInAuthUser({
      pin: this.codeValue,
      number: this.phoneForm.value.number
    }).pipe(
      finalize(()=>this.loading.hideLoading(loader)),
      catchError((error: serverError) => {
        this.toastService.showToast('Код не верный', 'danger')
        return throwError(error);
      })
    ).subscribe((res:any)=>{
      this.userService.setUserInLocalStorage(res.user,res.access_token)
      this.authService.setAuthToken(String(res.access_token))
      this.closePhoneLoginModal()
      setTimeout(()=>{
        this.router.navigate(['/cabinet'])
      },0)
    })
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
      this.loginInvalid.password.message = 'Такого аккаунта не существует, зарегестрировать?'
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
        this.userService.setUserInLocalStorage(res.user, res.access_token || null)
        this.authService.setAuthToken(String(res.access_token))
        setTimeout(()=>{
          this.navController.navigateForward(['/cabinet'])
        },150)

      })
    }
  }
  closePhoneLoginModal(){
    this.phoneLoginModalValue = false
  }
  openPhoneLoginModal(){
    this.phoneLoginModalValue = true
  }
  getCode(){
    let loader:HTMLIonLoadingElement
      this.loading.showLoading().then((response:HTMLIonLoadingElement)=>{
        loader = response
      })
      this.loginService.getPhoneCodeInAuthUser(this.phoneForm.value).pipe(
        finalize(()=>this.loading.hideLoading(loader)),
        catchError((err: serverError) => {
          this.errorResponseAfterLogin(err)
          if(err.status == 422){
            this.toastService.showToast('Такой номер телефона не зарегестрирован', 'warning')
            localStorage.setItem('sendPhoneVerificateCodeTime','')
          }
          return throwError(err)
        })
      ).subscribe(()=>{
        this.openPhoneLoginModal()
      })
  }
  submitPhoneForm(){
    this.formmatedPhone = this.phoneForm.value.number
    this.phoneForm.patchValue({number:this.phoneForm.value.number.replace(/\D/g, "")})
    if(this.phoneForm.valid){
       let now = moment()
        if(now.diff(moment(localStorage.getItem('sendPhoneVerificateCodeTime')),'seconds') > 60 ||  !localStorage.getItem('sendPhoneVerificateCodeTime')){
          localStorage.setItem('sendPhoneVerificateCodeTime',now.toISOString())
          this.getCode()
        }
        else{
          this.toastService.showToast(`Попробуйте через ${120 - now.diff(moment(localStorage.getItem('sendPhoneVerificateCodeTime')),'seconds')}`,'success')
        }
    } else{
      this.toastService.showToast('Номер телефона введен некорректно', 'warning')
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
    window.addEventListener('popstate', (event) => {
      this.closePhoneLoginModal()
    })
  }

} 
