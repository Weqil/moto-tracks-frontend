import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonModal, NavController } from '@ionic/angular/standalone';
import moment from 'moment';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { catchError, concatMap, EMPTY, finalize, from, Subject, takeUntil, tap } from 'rxjs';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { LoginService } from 'src/app/Shared/Data/Services/Auth/login.service';

import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';

@Component({
  selector: 'app-confirm-phone-page',
  templateUrl: './confirm-phone-page.component.html',
  styleUrls: ['./confirm-phone-page.component.scss'],
  imports:[IonContent,HeaderComponent,CommonModule,StandartInputComponent,StandartButtonComponent,IonModal,StandartInputSearchComponent,NgxOtpInputComponent]
})
export class ConfirmPhonePageComponent  implements OnInit {

  constructor() { }
  user!: User
  private readonly destroy$ = new Subject<void>()
  userService: UserService = inject(UserService)
  loginService: LoginService = inject(LoginService)
  loaderService:LoadingService = inject(LoadingService)
  navController:NavController = inject(NavController)
  regionModalState:boolean = false
  stepCurrent:number = 1
  toastService:ToastService = inject(ToastService)
  verificationType:string = 'code'
  mapService:MapService = inject(MapService)
  searchRegionItems:any[] = []
  codeValue:string = ''
  otpOptions: NgxOtpInputComponentOptions = {
      otpLength:4,
  }
  personalUserForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      patronymic: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
  })
  phoneForm: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required,Validators.minLength(11)])
  })
  formErrors:any = {
    name: {
      errorMessage:''

    },
    surname: {
       errorMessage:''
    },
    patronymic: {
      errorMessage:''
    },
    city: {
       errorMessage:''
    },
    dateOfBirth: {
       errorMessage:''
    },
    region: {
       errorMessage:''
    }
 }
 closeRegionModal(){
  this.regionModalState = false
}
openRegionModal(){
  this.regionModalState = true
}
changeVerificationState(state:string){
  this.verificationType = state
}
validatePersonal(){
  let valid = true
  Object.keys(this.personalUserForm.controls).forEach((key) => {
   const control = this.personalUserForm.get(key); // Доступ к контролу
   if (!control!.valid) {
     if(this.formErrors[key]){
       this.formErrors[key].errorMessage = 'Обязательное поле'; // Сообщение об ошибке
        valid = false
     } 
   } else {
       if( this.formErrors[key]){
         this.formErrors[key].errorMessage = ''; // Очистка сообщения об ошибке
       }
   }
 });
 return valid
}

async getCode(){
    this.phoneForm.patchValue({number:this.phoneForm.value.number.replace(/\D/g, "")})
    if(this.user?.phone?.number !== this.phoneForm.value.number){
      from(this.loaderService.showLoading()).pipe(
        tap((loader: HTMLIonLoadingElement) => {}),
        concatMap((loader) => 
          this.updateUserPhone().pipe(
            catchError((err:serverError)=>{
              console.log(err.error.message)
              if(err.error.message == 'Такое значение поля номер уже существует.'){
                this.toastService.showToast('Такой телефон уже привязан','danger')
              }
              return EMPTY
            }),
            concatMap(() => this.phoneSubmit().pipe(
              tap(()=>{
                this.toastService.showToast('Код был отправлен', 'success')
              }),
              catchError((err:serverError)=>{
                
                return EMPTY
              })
            )),
            finalize(() => {
              this.userService.refreshUser()
              this.loaderService.hideLoading(loader);
            })
          )
        )
      ).subscribe();
    } else{
      this.phoneSubmit().pipe().subscribe((res:any)=>{
        console.log(res)
        this.toastService.showToast('Код был отправлен', 'success')
      })
    }
}

sendCode(){
  this.phoneForm.patchValue({number:this.phoneForm.value.number.replace(/\D/g, "")})
  if(this.codeValue.length == 4 && this.phoneForm.valid){
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement) => {
        loader = res
      })
      this.loginService.submitPhoneCodeInAuthUser({
        pin: this.codeValue,
        number: this.phoneForm.value.number
      }).pipe(
        finalize(()=>{
          this.loaderService.hideLoading(loader)
        }),
        catchError((err:any)=>{
          this.toastService.showToast('Код не верный', 'danger')
          return EMPTY;
        })
      ).subscribe((res:any)=>{
        this.toastService.showToast('Телефон успешно подтверждён', 'success')
        this.userService.refreshUser()
        this.navController.navigateRoot('/cabinet')
      })
  } 
  else{
     this.toastService.showToast('Укажите телефон и введите код', 'danger')
  }
}

updateUserPhone(){
  this.phoneForm.patchValue({number:this.phoneForm.value.number.replace(/\D/g, "")})
  return this.userService.editUser(this.phoneForm.value).pipe()
 
}

phoneSubmit(){
  let now = moment()
  if(now.diff(moment(localStorage.getItem('sendPhoneVerificateCodeTime')),'seconds') > 120 ||  !localStorage.getItem('sendPhoneVerificateCodeTime')){
    localStorage.setItem('sendPhoneVerificateCodeTime',now.toISOString())
    return this.loginService.getPhoneCodeInAuthUser(this.phoneForm.value).pipe(
    )
  }else{
    this.toastService.showToast(`Попробуйте через ${120 - now.diff(moment(localStorage.getItem('sendPhoneVerificateCodeTime')),'seconds')} секунд`,'success')
    return EMPTY;
  }

}

submitPersonalInfo(){
  if(this.validatePersonal()){
    if(!this.user.personal){
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement) => {
        loader = res
      })
      this.userService.createPersonalInfo(this.personalUserForm.value).pipe(
        finalize(()=>{
          this.loaderService.hideLoading(loader)
        })
      ).subscribe((res:any)=>{
        this.userService.refreshUser()
      })
    }
    else{
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement) => {
        loader = res
      })
      this.userService.updatePersonalInfo(this.personalUserForm.value).pipe(
        finalize(()=>{
          this.loaderService.hideLoading(loader)
        })
      ).subscribe((res:any)=>{
        this.userService.refreshUser()
      })
    }
  }

}
  setRegion(region:any){
    this.closeRegionModal()
    this.personalUserForm.patchValue({locationId:region.value,region:region.name})
  }
  getRegions(){
    this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }

  ionViewWillEnter() {
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe((res:any)=>{
        this.user = res
        this.personalUserForm.patchValue({
          ...this.user?.personal,
          dateOfBirth: this.user?.personal?.date_of_birth
        })
        this.personalUserForm.invalid ? this.stepCurrent = 1 : this.stepCurrent = 2
      })
  }
  changeCode(code:any){
    this.codeValue = code.join('')
  }

  ngOnInit() {
    this.getRegions()
  }

}
