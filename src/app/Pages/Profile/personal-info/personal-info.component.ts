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
  
  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  loaderService:LoadingService = inject(LoadingService)
  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    patronymic: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dateOfBirth: new FormControl('', [Validators.required, Validators.minLength(3)]),
    city: new FormControl('', [Validators.required, Validators.minLength(3)]),
    inn: new FormControl('', [Validators.required, Validators.minLength(3)]),
    snils: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
    startNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
    group:new FormControl('', [Validators.required, Validators.minLength(3)]),
    rank:new FormControl('', [Validators.required, Validators.minLength(3)]),
    rankNumber:new FormControl('', [Validators.required, Validators.minLength(3)]),
    community:new FormControl('', [Validators.required, Validators.minLength(3)]),
    coach:new FormControl('', [Validators.required, Validators.minLength(3)]),
    motoStamp:new FormControl('', [Validators.required, Validators.minLength(3)]),
    engine:new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  submitForm(){
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
    
  }

  cancelEdit(){
    this.navController.back()
  }

  ionViewWillEnter() {
    console.log(this.userService.user.value)
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
