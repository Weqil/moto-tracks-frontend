import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { IonModal } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.scss'],
  imports: [SharedModule,HeaderModule,FormsModule,ButtonsModule]
})
export class UserDocumentsComponent  implements OnInit {
  navController:NavController = inject(NavController)
  constructor() { }
  oldLicensesValue?: {id:number,data:{licensesNumber:string,fileLink:string}} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  oldPolisValue?: { id:number, data:{polisNumber:string, issuedWhom:string,itWorksDate:string, fileLink:string}} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  loaderService:LoadingService = inject(LoadingService)
  oldPasportValue?:{id:number,data:{numberAndSeria:string, fileLink:string}} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  httpClient:HttpClient = inject(HttpClient)
  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)

  licensesForm: FormGroup = new FormGroup(
    {
      licensesNumber: new FormControl('',[Validators.required, Validators.minLength(3), ]), //номер лицензии
      licensesFileLink: new FormControl('',[Validators.required, Validators.minLength(3), ]), // путь до файла
    }
  )

  polisForm: FormGroup = new FormGroup(
    {
      polisNumber: new FormControl('',[Validators.required, Validators.minLength(3), ]), //Серия и номер полиса
      issuedWhom: new FormControl('',[Validators.required, Validators.minLength(3), ]), //Кем выдан
      itWorksDate: new FormControl('',[Validators.required, Validators.minLength(3), ]), //Срок действия
      polisFileLink: new FormControl('',[Validators.required, Validators.minLength(3), ]), // путь до файла
    }
  )
  pasportForm: FormGroup = new FormGroup(
    {
      numberAndSeria: new FormControl('',[Validators.required, Validators.minLength(3)]), //Серия и номер полиса
      pasportFileLink: new FormControl(''), // путь до файла
    }
  )

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


  checkFormInDublicatsOldValue(form: FormGroup, oldValue: any) {
    let dublicates: boolean = false;
  
    for (let key in form.value) {
      if (form.value[key] === oldValue[key]) {
        dublicates = true;
        break;
      }
    }
  
    return dublicates;
  }

  validateLicenses(){
    if(this.licensesForm.valid){
      return true
    }else{
      return false
    }
  }
  validatePolis(){
    
    if(this.polisForm.valid){
      return true
    }else{
      return false
    }
  }
  validatePasport(){
    if(this.pasportForm.valid ){
      return true
    }else{
      return false
    }
  }

  createLicenses(){
    this.loaderService.showLoading()
    this.userService.createUserDocument({type: 'licenses', data:(this.licensesForm.value)}).pipe(
    finalize(()=>{
      this.loaderService.hideLoading()
    })
  ).subscribe((res:any)=>{
    this.toastService.showToast('Данные лицензии успешно сохранены','success')
  })
  }

  createPasport(){
      this.loaderService.showLoading()
      this.userService.createUserDocument({type: 'pasport', data:(this.pasportForm.value)}).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные паспорте успешно сохранены','success')
    })
  }

  createPolis(){
     this.loaderService.showLoading()
      this.userService.createUserDocument({type: 'polis', data:(this.polisForm.value)}).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные полиса успешно сохранены','success')
    })
  }

  updateLicenses(){
    this.loaderService.showLoading()
    this.userService.updateDocument(Number(this.oldLicensesValue?.id),this.licensesForm.value).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные лицензии успешно обновлены','success')
    })
  }

  updatePasport(){
    this.loaderService.showLoading()
    this.userService.updateDocument(Number(this.oldPasportValue?.id),this.pasportForm.value).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные паспорта успешно обновлены','success')
    })
  }

  updatePolis(){
    this.loaderService.showLoading()
    this.userService.updateDocument(Number(this.oldPolisValue?.id),this.polisForm.value).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные полиса успешно обновлены','success')
    })
  }

  setFormValue(){
    this.loaderService.showLoading()
    this.userService.getUserDocuments().pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      if(res.documents){
        this.licensesForm.patchValue((res.documents.find((doc:any)=> doc.type === 'licenses')?.data))
        this.polisForm.patchValue((res.documents.find((doc:any)=> doc.type === 'polis')?.data))
        this.pasportForm.patchValue((res.documents.find((doc:any)=> doc.type === 'pasport')?.data))
        this.oldLicensesValue = (res.documents.find((doc:any)=> doc.type === 'licenses'))
        this.oldPolisValue = (res.documents.find((doc:any)=> doc.type === 'polis'))
        this.oldPasportValue = (res.documents.find((doc:any)=> doc.type === 'pasport'))
      }
     
    })
  }
  ionViewWillEnter(){
    this.setFormValue()
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
    }else{
      this.personalUserForm.reset()
    }
  }

  ngOnInit() {}

}
