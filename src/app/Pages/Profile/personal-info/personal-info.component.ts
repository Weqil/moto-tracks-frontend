import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  imports:[FormsModule, ReactiveFormsModule,SharedModule,HeaderModule,StandartButtonComponent]
})
export class PersonalInfoComponent  implements OnInit {
  navController:NavController = inject(NavController)
  constructor() { }
  formErrors:any = {
      name: {
        errorMessage:''

      },
      surname: {
         errorMessage:''
      },
      rank: {
        errorMessage:''
      },
      city: {
         errorMessage:''
      },
      startNumber: {
         errorMessage:''
      },
  }

  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  loaderService:LoadingService = inject(LoadingService)
  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    group:new FormControl('', [Validators.required]),
    rank:new FormControl('', [Validators.required]),
    rankNumber:new FormControl('', [Validators.required]),
    community:new FormControl('', [Validators.required]),
    coach:new FormControl('', [Validators.required]),
    motoStamp:new FormControl('', [Validators.required]),
    engine:new FormControl('', [Validators.required]),
    email:new FormControl('', [Validators.required])
  })

  userSettingsForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email:new FormControl('', [Validators.required])
  })

  submitValidate(){
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

  submitForm(){
    console.log(this.submitValidate())
    if(this.submitValidate()){
      this.loaderService.showLoading()
      if(this.userService.user.value?.personal){
        this.userService.updatePersonalInfo(this.personalUserForm.value).pipe(
          finalize(
            ()=>{
              this.loaderService.hideLoading()
            }
          )
        ).subscribe((res:any)=>{
          this.toastService.showToast('Данные успешно изменены', 'success')
          this.userService.refreshUser()
          this.navController.back();
        })
      }else{
          this.userService.createPersonalInfo(this.personalUserForm.value).pipe(
            finalize(
              ()=>{
                this.loaderService.hideLoading()
              })
          ).subscribe((res:any)=>{
            this.toastService.showToast('Данные успешно добавлены', 'success')
            this.userService.refreshUser()
            this.navController.back();
          })
      }
    }else{
      this.toastService.showToast('Заполните обязательные поля - Фамилия, имя, адрес, спортивное звание','danger')
    }
  
    
  }

  cancelEdit(){
    this.navController.back()
  }


  ionViewWillEnter() {
    this.userService.refreshUser()
    if(this.userService.user.value?.personal){
      this.personalUserForm.patchValue(this.userService.user.value?.personal)
      this.personalUserForm.patchValue({
        dateOfBirth: this.userService.user.value?.personal.date_of_birth,
        phoneNumber: this.userService.user.value?.personal.phone_number,
        startNumber: this.userService.user.value?.personal.start_number,
        rankNumber: this.userService.user.value?.personal.rank_number,
        motoStamp:  this.userService.user.value?.personal.moto_stamp
      })
      console.log(this.personalUserForm.value)
    }else{
      this.personalUserForm.reset()
    }
  }
  ngOnInit() {}

}
