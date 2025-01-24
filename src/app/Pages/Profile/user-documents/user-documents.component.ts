import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.scss'],
  imports: [SharedModule,HeaderModule,FormsModule,ButtonsModule]
})
export class UserDocumentsComponent  implements OnInit {

  constructor() { }
  oldLicensesValue?: {licensesNumber:string,fileLink:string} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  oldPolisValue?: { polisNumber:string, issuedWhom:string,itWorksDate:string, fileLink:string} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  loaderService:LoadingService = inject(LoadingService)
  oldPasportValue?:{numberAndSeria:string, fileLink:string} //Здесь будет храниться прошлое значение, которое мы получаем с сервера
  userService:UserService = inject(UserService)

  licensesForm: FormGroup = new FormGroup(
    {
      licensesNumber: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), //номер лицензии
      fileLink: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), // путь до файла
    }
  )

  polisForm: FormGroup = new FormGroup(
    {
      polisNumber: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), //Серия и номер полиса
      issuedWhom: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), //Кем выдан
      itWorksDate: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), //Срок действия
      fileLink: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), // путь до файла
    }
  )
  pasportForm: FormGroup = new FormGroup(
    {
      numberAndSeria: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), //Серия и номер полиса
      fileLink: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]), // путь до файла
    }
  )


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
    if(this.licensesForm.valid && !this.checkFormInDublicatsOldValue(this.licensesForm, this.oldLicensesValue)){
      return true
    }else{
      return false
    }
  }
  validatePolis(){
    
    if(this.polisForm.valid && !this.checkFormInDublicatsOldValue(this.polisForm, this.oldPolisValue)){
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
    this.userService.createUserDocument({
      type: 'licenses',
      data: this.licensesForm.value
    })
  }
  createPasport(){
    this.userService.createUserDocument({type: 'pasport', data:JSON.stringify(this.pasportForm.value)}).pipe().subscribe((res:any)=>{
      console.log(res)
    })
  }
  createPolis(){
    this.userService.createUserDocument({
      type: 'polis',
      data: {...this.polisForm.value}
    })
  }



  ngOnInit() {}

}
