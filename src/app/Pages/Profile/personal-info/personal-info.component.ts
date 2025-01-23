import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  imports:[FormsModule, ReactiveFormsModule,SharedModule,HeaderModule,StandartButtonComponent]
})
export class PersonalInfoComponent  implements OnInit {

  constructor() { }
  
  userService:UserService = inject(UserService)

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
    if(this.userService.user.value?.personalInfo){
      this.userService.updatePersonalInfo(this.personalUserForm.value).pipe().subscribe((res:any)=>{
        console.log(res)
        this.userService.refreshUser()
      })
    }else{
        this.userService.createPersonalInfo(this.personalUserForm.value).pipe().subscribe((res:any)=>{
          console.log(res)
          this.userService.refreshUser()
        })
    }
  }

  ngOnInit() {}

}
