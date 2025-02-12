import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { NavController } from '@ionic/angular/standalone';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { RegisterService } from 'src/app/Shared/Data/Services/Auth/register.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { Login } from 'src/app/Shared/Data/Interfaces/login-model';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { Router } from '@angular/router';
import { IonCheckbox } from '@ionic/angular/standalone';


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
  imports: [SharedModule, HeaderModule, FormsModule, ButtonsModule,IonCheckbox]
})
export class RegistrationPageComponent  implements OnInit {

  private readonly navController: NavController = inject(NavController)
  private readonly loading:LoadingService = inject(LoadingService)
  private readonly registerService: RegisterService = inject(RegisterService)
  private userService: UserService = inject(UserService)
  private authService: AuthService = inject(AuthService)
  private router:Router = inject(Router)
  isCheckedFirst: boolean = false;
  isCheckedSecond: boolean = false;
  
  

  constructor() { }

  onCheckboxChange(event:any){
    this.isCheckedFirst=event.detail.checked;
   
    console.log('чекбокс изменился', this.isCheckedFirst)
  }
  onCheckboxChange2(event:any){
    
    this.isCheckedSecond=event.detail.checked;
    console.log('чекбокс изменился', this.isCheckedSecond)
  }

    registerForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
    registerInvalid:any = {
      localError: false,
      serverError: false,
      name: {
        status: false,
        message: '',
      },
      email: {
        status: false,
        message: '',
      },
      password: {
        status: false,
        message: '',
      },
      password_confirmation: {
        status: false,
        message: '',
      },
    }

    validateForm() {
      this.registerInvalid.localError = false
      if (this.registerForm.get('name')?.errors) {
        this.registerInvalid.localError = true
        this.registerInvalid.name.status = true
        this.registerInvalid.name.message = this.registerForm.get('name')?.hasError('required')
          ? 'Поле не может быть пустым'
          : 'Имя должно быть не менее 3 символов'
      } else {
        this.registerInvalid.name.status = false
        this.registerInvalid.name.message = ''
      }

      if (this.registerForm.get('email')?.errors) {
        this.registerInvalid.localError = true
        this.registerInvalid.email.status = true
        if( this.registerForm.get('email')?.hasError('required')){
          this.registerInvalid.email.message = 'Поле не может быть пустым'
        }
        else if(this.registerForm.get('email')?.hasError('minLength')){
          this.registerInvalid.email.message = 'E-mail должен быть не менее 3 символов'
        }
        else{
          this.registerInvalid.email.message = 'E-mail некоректный'
        }
      }else{
        this.registerInvalid.email.status = false
        this.registerInvalid.email.message = ''
      }

      if (this.registerForm.get('password')?.errors) {
        this.registerInvalid.localError = true
        this.registerInvalid.password.status = true
        this.registerInvalid.password.message = this.registerForm.get('password')?.hasError('required')
          ? 'Поле не может быть пустым'
          : 'Пароль должен быть не менее 8 символов'
      } else {
        this.registerInvalid.password.status = false
        this.registerInvalid.password.message = ''
      }
      
     
      if(this.registerForm.get('password_confirmation')?.value !== this.registerForm.get('password')?.value){
        this.registerInvalid.localError = true
        this.registerInvalid.password_confirmation.status = true
        this.registerInvalid.password.status = true
        this.registerInvalid.password_confirmation.message = 'Пароли не совпадают'
      }else{
        this.registerInvalid.password_confirmation.status = false
        this.registerInvalid.password_confirmation.message = ''
      }
     
  }
  createFormData() {
    const fd: FormData = new FormData()
    fd.append('name', this.registerForm.get('name')?.value)
    fd.append('email', this.registerForm.get('email')?.value)
    fd.append('password', this.registerForm.get('password')?.value)
    fd.append('password_confirmation', this.registerForm.get('password_confirmation')?.value)
    return fd
  }
  errorResponseAfterReg(err:any){
    let message:any[] = err.error.errors
    Object.keys(message).forEach((err:any)=>{
      this.registerInvalid[err].status = true
      this.registerInvalid[err].message = message[err][0]
    })
    this.registerInvalid.serverError = true
  }
  register(data: FormData): void {
    this.registerService.registerUser(data).pipe(
      catchError((err: serverError) => {
        this.errorResponseAfterReg(err)
        // this.errorText = err
        this.loading.hideLoading()
        return EMPTY
      }),
      
      finalize(()=>{
        this.loading.hideLoading()
      })
    ).subscribe((res:Login)=>{
      this.userService.setUserInLocalStorage(res.user)
      this.authService.setAuthToken(String(res.access_token))
      // this.navController.navigateForward('/cabinet', {  animated: false })
      this.router.navigate(['/verification'])
    })
  }

    submitLoginForm() {
      this.registerForm.patchValue({
        name: this.registerForm.value.email
      })
      this.validateForm()
      if (!this.registerInvalid.localError) {
        this.loading.showLoading()
        const fd:FormData = this.createFormData()
        this.register(fd)
      }

  
    }

    redirectInLogin() {
      this.navController.navigateForward('/login', {animationDirection: 'forward'})
    }

    redirectInUserAgreement() {
      this.navController.navigateForward('/user-agreement', {animationDirection: 'forward'})
    }

    redirectInUserPolitic() {
      this.navController.navigateForward('/user-politic', {animationDirection: 'forward'})
    }
    

  ngOnInit() {
  
  }

}
