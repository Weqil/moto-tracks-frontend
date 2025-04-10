import { Component, inject, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NgClass } from '@angular/common';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { LoginService } from 'src/app/Shared/Data/Services/Auth/login.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { catchError, EMPTY, finalize, Subject, takeUntil } from 'rxjs';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],
  imports:[SharedModule,HeaderModule,NgxOtpInputComponent,ButtonsModule,NgClass]
})
export class ConfirmEmailPageComponent  implements OnInit {

  constructor() { }
  userService: UserService = inject(UserService)
  authService:AuthService = inject(AuthService)
  toastService:ToastService = inject(ToastService)
  loadingService:LoadingService = inject(LoadingService)
  navController:NavController = inject(NavController)
  codeValue:string = ''
  loginService:LoginService = inject(LoginService)
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength:4,
  }
  timerActive: boolean = false

  totalTime: number = 60; 
  timeLeft: number = this.totalTime;
  displayTime: string = '01:00';
  

  user!: User
  private readonly destroy$ = new Subject<void>()


  changeCode(code:any){
    this.codeValue = code.join('')
  }

  showMessage(){
    this.toastService.showToast('Повторный код отправлен на почту','success')
  }

  getCodeInEmail(){
    if(!this.user.email_verified_at && this.authService.isAuthenticated()){
      this.loginService.getCodeInEmailConfirm().pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        }),
      ).subscribe((res:any)=>{
      
      })
      
    }else if(this.user.email_verified_at && this.authService.isAuthenticated()){
      this.toastService.showToast('Почта уже подтверждена','warning')
      this.navController.navigateForward('/cabinet')
    }else{
      this.toastService.showToast('Вы не авторизованы','warning')
      this.navController.navigateForward('/login')
    }
  }

  submitMessage(){
   
    if(this.codeValue.length == 4){
       this.loadingService.showLoading()
       this.loginService.submitCodeInEmail(this.codeValue).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        }),
        catchError((err:any)=>{
          if(err.error.message == 'Код не подходит' ){
            this.toastService.showToast('код не верный','danger')
          }
          return EMPTY
        })
       ).subscribe((res:any)=>{
        this.toastService.showToast('Почта подтверждена','success')
        this.userService.refreshUser()
          this.navController.navigateForward('/cabinet')
       })
    } else {
      this.toastService.showToast('код должен состоять из 4 символов','danger')
    }
  }

  ionViewWillEnter() {
  
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
      this.user = res
      this.getCodeInEmail()
    })
 
  }
  ionViewDidEnter() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  changeClassSpan(){
    this.timerActive = true

    setTimeout(()=>{
      this.timerActive = false;
    }, 1 * 60 * 1000)
  }

  startTimer(){
    interval(1000).pipe(take(this.totalTime), map(()=>{
      this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return { minutes, seconds };
    })
  ).subscribe(({ minutes, seconds })=>{
      this.displayTime = `${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`;
      
    })

    this.displayTime = '01:00';
    this.timeLeft = this.totalTime;
  }

  addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  redirectCabinet(){
    this.navController.navigateForward('/cabinet')
  }

  ngOnInit() {
  
  }

}
