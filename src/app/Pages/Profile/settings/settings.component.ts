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
import { catchError, EMPTY, finalize } from 'rxjs';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { NavController } from '@ionic/angular';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { IonCheckbox, IonModal } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [SharedModule, CommonModule, HeaderModule, FormsModule,  ButtonsModule, UserModule,
    ProfileModule, selectedModule, IonModal,IonCheckbox,RouterLink]
})
export class SettingsComponent  implements OnInit {
  authService: any;
  navControler: NavController = inject(NavController);
  checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)
  private readonly loading:LoadingService = inject(LoadingService)

  userAgreedStatus:any = localStorage.getItem('userAgreedStatus')
  userAgreedModalState:boolean = false
  statusesSelect:boolean = false
  selectedStatusItem:any  = {}
  disabledAgreedButton:boolean = true
  statuses:any[] = [];

  constructor() { }

  backNavigate() {
    this.navControler.back();
  }
  

  formErrors:any = {
    name: {
      errorMessage:''

    },
    email: {
       errorMessage:''
    },
   
}

  avatarUrl:string = ''

  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  loaderService:LoadingService = inject(LoadingService)
  settingsAvatar:string = ''
  userSettingsForm: FormGroup = new FormGroup({
    avatar: new FormControl('', [Validators.required])
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
  changeAgreedState(event:any){
    this.disabledAgreedButton = !event.target.checked
  }
  openSelectedStatus(){
    this.openModalStateAgreed()
    if(!this.userService.userHaveRoot() && this.userAgreedStatus !== 'false' && this.userAgreedStatus){
      this.statusesSelect = true;
    }
  }
  closeSelectedStatus(){
    this.statusesSelect = false;
  }

  openModalStateAgreed(){
    this.userAgreedStatus = localStorage.getItem('userAgreedStatus')
    if(this.userAgreedStatus == 'false' || !this.userAgreedStatus){
      this.userAgreedModalState = true
    }
  
  }
  closeStateAgreedModal(){
  
    if(!this.disabledAgreedButton){
      localStorage.setItem('userAgreedStatus','true')
      this.userAgreedStatus = true
      this.userAgreedModalState = false
  
    }
  }
  navigateInAgreed(){
    this.userAgreedModalState = false
    setTimeout(()=>{
      this.navControler.navigateForward('/distribution-agreement')
    },0)
  }

  logoutInAccount() {
    this.authService.logout()
    this.navControler.navigateForward('/login',{  animated: false })
  }

  setAvatar(event:any){
    const file = event.target.files[0]
    if(file){
      this.userSettingsForm.patchValue({ avatar: file })
      const reader: FileReader = new FileReader()
      reader.onload = (e: any) => {
        this.settingsAvatar = e.target.result
        this.avatarUrl = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  submitEditForm(){
    this.loaderService.showLoading()
    let fd : FormData = new FormData()
    fd.append('avatar', this.userSettingsForm.value.avatar)
    this.userService.editUser(fd).pipe(finalize(()=>{
      this.loaderService.hideLoading()
    }),
    catchError((err:serverError)=>{
      this.toastService.showToast(err.error.message,'danger')
      return EMPTY
    })
  ).subscribe(()=>{
      this.toastService.showToast('Изменения сохранены','success')
      this.userService.refreshUser()
      this.navControler.back()
    })
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
      if(this.user?.roles.length && !this.userService.userHaveRoot()){
        const matchingStatus = this.statuses.find((statusItem: any) => 
          this.user?.roles.some((role: any) => role.id === statusItem.id)
        );
        if(matchingStatus){
          this.selectedStatusItem = matchingStatus
        }else{

        }
      } 
      else if(this.userService.userHaveRoot()){
        this.selectedStatusItem = {
          id: 4,
          name: 'Комиссия',
          value: 'Комиссия',
        }
      }
      else{
        this.selectedStatusItem = {
          id: 0,
          name: 'Болельщик',
          value: 'Болельщик',
        }
      }
    })

   
    this.userService.user.pipe().subscribe(()=>{
      this.user = this.userService.user.value
      this.settingsAvatar = this.checkImgUrlPipe.checkUrlDontType(this.user?.avatar) 
    })
  }

  closeModalAgreedNotVerificated(){
    this.userAgreedStatus = 'false'
    this.userAgreedModalState = false
  }

  ionViewDidLeave(){
    this.userAgreedModalState = false
  }

  ngOnInit() { this.userService.user.pipe().subscribe(()=>{
    this.user = this.userService.user.value 
  })}

}
