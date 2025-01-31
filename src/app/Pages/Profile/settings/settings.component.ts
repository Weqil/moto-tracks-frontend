import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [SharedModule, CommonModule, HeaderModule, FormsModule, StandartInputComponent, ButtonsModule, CheckImgUrlPipe,UserModule,
    ProfileModule]
})
export class SettingsComponent  implements OnInit {
  authService: any;
  navControler: any;

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

  ngOnInit() {}

}
