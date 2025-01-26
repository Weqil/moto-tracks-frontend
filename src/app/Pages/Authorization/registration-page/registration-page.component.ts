import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
  imports: [SharedModule, HeaderModule, FormsModule, ButtonsModule]
})
export class RegistrationPageComponent  implements OnInit {

  private readonly navController: NavController = inject(NavController)
  private readonly loading:LoadingService = inject(LoadingService)
  private readonly registerService: RegisterService = inject(RegisterService)
  private userService: UserService = inject(UserService)
  private authService: AuthService = inject(AuthService)
  private router:Router = inject(Router)
  

  constructor() { }

    registerForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
    registerInvalid = {
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
  }
  createFormData() {
    const fd: FormData = new FormData()
    fd.append('name', this.registerForm.get('name')?.value)
    fd.append('email', this.registerForm.get('email')?.value)
    fd.append('password', this.registerForm.get('password')?.value)
    fd.append('password_confirmation', this.registerForm.get('password_confirmation')?.value)
    return fd
  }
  register(data: FormData): void {
    this.registerService.registerUser(data).pipe(
      catchError((err: serverError) => {
        console.log(err)
        // this.errorResponseAfterLogin(err)
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
      console.log(res.access_token)
      // this.navController.navigateForward('/cabinet', {  animated: false })
      this.router.navigate(['/cabinet'])
    })
  }

    submitLoginForm() {
      this.validateForm()
      this.loading.showLoading()
      const fd:FormData = this.createFormData()
      this.register(fd)
      console.log(this.registerForm)
    }

    redirectInLogin() {
      this.navController.navigateForward('/login', {animationDirection: 'forward'})
    }

  ngOnInit() {
  
  }

}
