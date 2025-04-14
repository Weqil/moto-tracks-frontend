import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../Shared/Components/UI/header/header.component";
import { IonicModule } from '@ionic/angular';
import { FormsModule } from "../../../Shared/Modules/forms/forms.module";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StandartButtonComponent } from "../../../Shared/Components/UI/Buttons/standart-button/standart-button.component";
import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { catchError, finalize, of, throwError } from 'rxjs';
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { ToastService } from '@app/Shared/Services/toast.service';
import { userRoles } from '@app/Shared/Data/Enums/roles';


@Component({
  selector: 'app-add-user-in-comission',
  templateUrl: './add-user-in-comission.component.html',
  styleUrls: ['./add-user-in-comission.component.scss'],
  imports: [CommonModule, HeaderComponent, IonicModule, FormsModule, StandartButtonComponent, CheckImgUrlPipe],
})
export class AddUserInComissionComponent  implements OnInit {

  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  loaderService:LoadingService = inject(LoadingService)
  toastService:ToastService = inject(ToastService)

  constructor() { }

  ngOnInit() {}
  user!:User 
  id:string = ''
  viewUserInfo: boolean = true
  UserIdForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    }
  )



  viewUser(){
    
    this.id = this.UserIdForm.get('userId')?.value
    if(this.id == ''){
      this.viewUserInfo = true
    }
    else{
      this.getUser()
    }
    
  }

  awardRole(){

    if(this.userService.userHaveCurrentPersonal(this.user)){
      console.log(this.user)
      let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    this.userService.addUserCommissionRole(this.id).pipe(
      catchError(error => {
        this.toastService.showToast('Ошибка в назначении судьи', 'warning')
        this.viewUserInfo = true
        return throwError(()=> error)
      }),
      finalize(()=>{
        this.loadingService.hideLoading(loader)  
      })
    ).subscribe((res:any) => {
        this.toastService.showToast('Судья успешно назначен', "success")
        this.userService.refreshUser()
        // this.getUser()
        this.viewUserInfo = true
    })

    }
    else{
      this.toastService.showToast('Пожалуйста попросите пользователя стать организатором и заполнить анкету!','warning')
    }

    
  }

  translateRole(roleName: string){

    if(roleName == userRoles.rider)
    {
      roleName = 'Гонщик'
    }
    else 
    if(roleName == userRoles.organization)
      {
        roleName = 'Организатор'
      }
    else 
    if(roleName == userRoles.couch)
      {
        roleName = 'Тренер'
      }
    else 
    if(roleName == userRoles.admin)
      {
        roleName = 'Администратор'
      }
    else 
    if(roleName == userRoles.root)
      {
        roleName = 'Root'
      }
    else 
    if(roleName == userRoles.commission)
      {
        roleName = 'Комиссия'
      }

    return roleName

  }

  getUser(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    
    this.userService.getUserById(this.id).pipe(

      catchError(error => {

        this.toastService.showToast('Такого пользователя нет в системе', 'warning')
        this.viewUserInfo = true
        return throwError(()=> error)
        
      }),


      finalize(()=>{
        this.loadingService.hideLoading(loader)  
      })
    ).subscribe((res:any) => {
      this.user = res.user
      this.viewUserInfo = false
      // console.log('emae2:')
      // console.log(this.user)
    })
   }
}
