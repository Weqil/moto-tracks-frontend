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
import { finalize } from 'rxjs';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { NavController } from '@ionic/angular';

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
  navControler: NavController = inject(NavController);

  private readonly loading:LoadingService = inject(LoadingService)

  statusesSelect:boolean = false
  selectedStatusItem:any  = {
    id: 0,
    name: 'Болельщик',
    value: 'Болельщик',
  }
  statuses:any[] = [];

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

  selectStatus(event:any){
    if(event.id !== 0){
      if(this.userService.isEmailVerified()){
        this.loaderService.showLoading()
        this.userService.changeRoleForDefaultUser(event.id).pipe(finalize(()=>{
          this.loaderService.hideLoading()
        })).subscribe((res:any)=>{
          this.toastService.showToast('Статус успешно изменен','success')
          this.userService.refreshUser()
        })
      }else{
        this.toastService.showToast('Для смены статуса подтвердите вашу почту','warning')
        this.navControler.navigateForward('/verification')
      }
    
    }
    this.selectedStatusItem = event;
  }
  openSelectedStatus(){
    this.statusesSelect = true;
  }
  closeSelectedStatus(){
    this.statusesSelect = false;
  }

  logoutInAccount() {
    this.authService.logout()
    this.navControler.navigateForward('/login',{  animated: false })
  }

  ionViewWillEnter(){
    this.loading.showLoading()
    this.userService.getChangeRoles().pipe(
      finalize(()=>{
        this.loading.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.statuses = []
      res.role.forEach((roleItem:any) => {
        this.statuses.push({
          id:roleItem.id,
          name: roleItem.name == userRoles.organization ? 'Организатор': 'Гонщик',
          value: roleItem.name,
        })
      });
      if(this.user?.roles.length){
        const matchingStatus = this.statuses.find((statusItem: any) => 
          this.user?.roles.some((role: any) => role.id === statusItem.id)
        );
        if(matchingStatus){
          this.selectedStatusItem = matchingStatus
        }else{
        }
      } else{
        this.selectedStatusItem = {
          id: 0,
          name: 'Болельщик',
          value: 'Болельщик',
        }
      }
    })

   
    this.userService.user.pipe().subscribe(()=>{
      this.user = this.userService.user.value
      this.settingsAvatar = this.user?.avatar ? this.user?.avatar : ''
      this.userSettingsForm.patchValue({
        name: this.user?.personal?.name,
        email: this.user?.email
      })
    })
  }

  ngOnInit() { this.userService.user.pipe().subscribe(()=>{
    this.user = this.userService.user.value 
  })}

}
