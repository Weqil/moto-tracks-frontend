import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { StandartInputComponent } from "../../../Shared/Components/Forms/standart-input/standart-input.component";
import { ButtonsModule } from "../../../Shared/Modules/buttons/buttons.module";
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';
import { selectedModule } from "../../../Shared/Modules/selected/selected.module";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [SharedModule, CommonModule, HeaderModule, FormsModule, StandartInputComponent, ButtonsModule, CheckImgUrlPipe, UserModule,
    ProfileModule, selectedModule]
})
export class SettingsComponent  implements OnInit {
  authService: any;
  navControler: any;

  statusesSelect:boolean = false
  selectedStatusItem!:any 
  statuses:any[] = [
    { id: 1, name: 'Гонщик', value: 'Гонщик' },
    { id: 2, name: 'Организатор', value: 'Организатор' },
    { id: 3, name: 'Болельщик', value: 'Болельщик' },

  ];

  setNewStatusModalOpen(){
  }
  selectStatus(event:any){
    this.selectedStatusItem = event;
    localStorage.setItem('user-status', event.id)
    console.log( this.selectedStatusItem)
  }
  openSelectedStatus(){
    this.statusesSelect = true;
  }
  closeSelectedStatus(){
    this.statusesSelect = false;
  }

  constructor() { }

  

  formErrors:any = {
    name: {
      errorMessage:''

    },
    email: {
       errorMessage:''
    },
   
}

  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  loaderService:LoadingService = inject(LoadingService)
  settingsAvatar:string = ''
  userSettingsForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email:new FormControl('', [Validators.required])
  })

  user!:User|null

  ionViewWillEnter(){
    let userStatus = Number(localStorage.getItem('user-status'))
    console.log('чекаю юзера')
    if(userStatus == 1){
      this.selectedStatusItem = { id: 1, name: 'Гонщик', value: 'Гонщик' }
    }else if(userStatus == 2){
      this.selectedStatusItem = { id: 2, name: 'Организатор', value: 'Организатор' }
    }else if(userStatus == 3){
      this.selectedStatusItem = { id: 3, name: 'Болельщик', value: 'Болельщик' }
    }
    this.userService.user.pipe().subscribe(()=>{
      this.user = this.userService.user.value
      this.settingsAvatar = this.user?.avatar ? this.user?.avatar : ''
      console.log( this.user)
      this.userSettingsForm.patchValue({
        name: this.user?.personal?.name,
        email: this.user?.email
      })
    })
  }

  logoutInAccount() {
    this.authService.logout()
    this.navControler.navigateForward('/login',{  animated: false })
  }

  ngOnInit() { this.userService.user.pipe().subscribe(()=>{
    this.user = this.userService.user.value 
  })}

}
