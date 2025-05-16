import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { ButtonsModule } from "../../../Shared/Modules/buttons/buttons.module";
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { NoDataFoundComponent } from 'src/app/Shared/Components/UI/no-data-found/no-data-found.component';
import { NgZone } from '@angular/core';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';
import { selectedModule } from "../../../Shared/Modules/selected/selected.module";
import { catchError, EMPTY, finalize, Subject, takeUntil, throwError } from 'rxjs';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { NavController } from '@ionic/angular';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { IonCheckbox, IonModal, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '@app/Shared/Data/Services/Auth/auth.service';
import { UserStatuses,translitUserStatuses } from 'src/app/Shared/Enums/user-status';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { CheckUserRoleService } from '@app/Shared/Data/Services/check-user-role.service';
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule,
    CommonModule,
    HeaderModule,
    StandartInputComponent,
    UserModule,
    ProfileModule,
    selectedModule,
    IonModal,
    IonCheckbox,
    RouterLink,
    StandartInputComponent,
    NoDataFoundComponent,
    IconButtonComponent,
    CheckImgUrlPipe
],
  standalone: true
})
export class SettingsComponent  implements OnInit {
  authService: AuthService = inject(AuthService);
  navControler: NavController = inject(NavController);
  checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)
  private readonly loading:LoadingService = inject(LoadingService)
  userAgreedStatus:any = localStorage.getItem('userAgreedStatus')
  userAgreedModalState:boolean = false
  checkUserRoleService:any = inject(CheckUserRoleService)
  selectRoleModalState:boolean = false
  statusesSelect:boolean = false
  selectedStatusItem:any  = {}
   private readonly destroy$ = new Subject<void>()
  disabledAgreedButton:boolean = true
  statuses:any[] = [];
  emailModalValue:boolean = false
  phoneModalValue:boolean = false
  userLastRoleValue:string = ''
  emailStatus:boolean = false
  phoneStatus:boolean = false

  checkVerifiedEmail(){
    if(this.user?.email_verified_at){

      this.emailStatus = true

    }
  }

  checkVerifiedPhone(){
    if(this.user?.phone?.number_verified_at){

      this.phoneStatus = true

    }
  }

  personalSettingsForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  })

  personalViewForm: FormGroup = new FormGroup({
    phoneView: new FormControl('', [Validators.required]),
    emailView: new FormControl('', [Validators.required]),
  })

  openEmailModal(){
    this.emailModalValue = true
  }
  closeEmailModal(){
    this.emailModalValue = false
  }
  openSelectRoleModal(){
    if(!this.userService.userHaveRoot()){
      this.openSelectedStatus()
      this.selectRoleModalState = true
    }
  
  }
  closeSelectRoleModal(){
    this.selectRoleModalState = false
  }
  openPhoneModal(){
    this.phoneModalValue = true
  }
  closePhoneModal(){
    this.phoneModalValue = false
  }

  loginInvalid = {
    localError: false,
    serverError: false,
    name: {
      status: false,
      message: '',
    },
    password: {
      status: false,
      message: '',
    },
  }

  back(){
    this.navControler.back() 
  }

  validateForm() {
    this.loginInvalid.localError = false
     if(this.personalSettingsForm.get('name')?.hasError('minLength')){
        this.loginInvalid.name.message = 'E-mail должен быть не менее 3 символов'
      } else{
        this.loginInvalid.name.message = 'E-mail некоректный'
      }
    }

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private navController: NavController,
    private alertController: AlertController,
    private ngZone: NgZone
  ) {}



  formErrors:any = {
    phone: {
      errorMessage:''

    },
    email: {
       errorMessage:''
    },
   
}
 userLastRole(user:User){

  if( this.checkUserRoleService.searchLastRole(user)){
   this.userLastRoleValue =  translitUserStatuses[this.checkUserRoleService.searchLastRole(user).name as keyof typeof translitUserStatuses]
  } else{
    this.userLastRoleValue = 'Болельщик'
  }
  

}

editEmail(){  
  this.validateForm();
  let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
  this.userService.editUser(this.personalSettingsForm.value).pipe(
    catchError(error => {

      this.toastService.showToast('Такая почта уже есть', 'warning')
      
      return throwError(()=> error)
      
    }),
    finalize(() => {
      this.loadingService.hideLoading(loader);
    })
  ).subscribe((res:any)=>{
    this.checkVerifiedEmail()
    this.closeEmailModal();
    this.userService.refreshUser(() => {
      this.personalViewForm.patchValue({ emailView: this.personalSettingsForm.get('email')?.value, phoneView: this.personalSettingsForm.get('phone')});
      this.navController.navigateRoot('/verification');
    });
    // this.personalViewForm.patchValue({emailView: this.personalSettingsForm.get('email')?.value})
    // this.personalViewForm.patchValue({emailView: this.user?.email})
    // this.closeEmailModal()

    
    // this.navController.navigateRoot('/verification')
    }
  )

}

confirmEmail(){
  this.closeEmailModal()
  setTimeout(() => {
    
    this.navController.navigateRoot('/verification'); // Переход после задержки
  }, 300); // Задержка в 300 миллисекунд
}

confirmPhone(){

  
  this.closePhoneModal()
  
    this.deletePhoneForUserId().then(()=>{
      this.userService.refreshUser().then(()=>{
        this.navController.navigateRoot('/confirm-phone')
      })
    })
  
    
  
}


deletePhoneForUserId(){
  return new Promise((resolve, reject)=>{
  
    if(this.user?.phone){
      let loader:HTMLIonLoadingElement
          this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
            loader = res
          })
    
          this.userService.deletePhoneUser(this.user?.id).pipe(
            catchError(error => {
        
              this.toastService.showToast('Ошибка удаления номера телефона', 'warning')
              console.log(error)
              return throwError(()=> error)
            }),
            finalize(() => {
         
              this.loadingService.hideLoading(loader);
              resolve(true)
            })
          ).subscribe((res)=>{
            
            resolve(true)
          })
      
      }else{
        resolve(true)
        this.checkVerifiedPhone()
        this.navController.navigateRoot('/confirm-phone');
      }
  })
  
  
}

  avatarUrl:string = ''

 
  settingsAvatar:string = ''
  userSettingsForm: FormGroup = new FormGroup({
    avatar: new FormControl('', [Validators.required])
  })


  user!:User|null

  selectStatus(event:any){
   const closeModal = new Promise((resolve)=>{

    this.selectRoleModalState = false
    setTimeout(()=>{
      resolve(true)
    },300)
   }).then(()=>{
    if(event.value == userRoles.organization){
      if(this.userService.isPhoneVerified() && this.userService.userHaveCurrentPersonal()){
        this.loadingService.showLoading()
        this.userService.changeRoleForDefaultUser(event.id).pipe(finalize(()=>{
        this.loadingService.hideLoading()
       })).subscribe((res:any)=>{
         this.selectedStatusItem = event;
         this.toastService.showToast('Статус успешно изменен','success')
         this.userService.refreshUser()})
      }
      else{
        this.navControler.navigateForward('/confirm-phone')
      }
    }
    if(event.value == userRoles.rider ){
      if(this.userService.isPhoneVerified() || this.userService.isEmailVerified()){
        this.loadingService.showLoading()
        this.userService.changeRoleForDefaultUser(event.id).pipe(finalize(()=>{
                this.loadingService.hideLoading()
       })).subscribe((res:any)=>{
         this.selectedStatusItem = event;
         this.toastService.showToast('Статус успешно изменен','success')
         this.userService.refreshUser()})
      }
      else{
        this.navControler.navigateForward('/confirm-phone')
      }
    }

    if(event.value == userRoles.couch){
      if((this.userService.isPhoneVerified() || this.userService.isEmailVerified() )&& this.userService.userHaveCurrentPersonal()){
        this.loadingService.showLoading()
        this.userService.changeRoleForDefaultUser(event.id).pipe(finalize(()=>{
                this.loadingService.hideLoading()
       })).subscribe((res:any)=>{
         this.selectedStatusItem = event;
         this.toastService.showToast('Статус успешно изменен','success')
         this.userService.refreshUser()})
      }
      else{
        this.navControler.navigateForward('/confirm-phone')
      }
    }
   })
   
    
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
    let user = this.userService.user.value
    if(user){
      this.userService.deleteUserInUsersArrayInLocalStorage(user)
    }
 
    this.authService.logout()
    this.navControler.navigateForward('/select-auth',{  animated: false })
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
     const readerPromise = new Promise((resolve)=>{
      resolve(reader.readAsDataURL(file))
     }) 
     readerPromise.then(()=>{
      this.submitAvatar()
     })
    }
  }

  submitAvatar(){
    this.loadingService.showLoading()
    let fd : FormData = new FormData()
    fd.append('avatar', this.userSettingsForm.value.avatar)
    
    this.userService.editUser(fd).pipe(finalize(()=>{
      this.loadingService.hideLoading()
    }),
    catchError((err:serverError)=>{
      this.toastService.showToast(err.error.message,'danger')
      return EMPTY
    })
  ).subscribe(()=>{
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
          name: roleItem.name === userRoles.organization ? 'Организатор'
          : roleItem.name === userRoles.couch ? 'Тренер' 
          : roleItem.name === userRoles.admin ? 'Администратор' 
          : roleItem.name === userRoles.commission ? 'Комиссия' 
          : roleItem.name === userRoles.root ? 'Root' 
          : 'Гонщик',
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
          id: 5,
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
      this.checkVerifiedEmail()
      this.checkVerifiedPhone()
      // this.selectedStatusItem = this.user?.roles[0].name
    })
  }

  closeModalAgreedNotVerificated(){
    this.userAgreedStatus = 'false'
    this.userAgreedModalState = false
  }

  ionViewDidLeave(){
    this.userAgreedModalState = false
    this.destroy$.next()
    this.destroy$.complete()
  }

  

  ngOnInit() { 
    
    window.addEventListener('popstate', (event) => {
      this.closeEmailModal()
    });
    
    this.userService.user.pipe(
      takeUntil(this.destroy$)
    ).subscribe(()=>{
    this.user = this.userService.user.value 
    if(this.user){
      this.userLastRole(this.user)
    }
    this.personalViewForm.patchValue({phoneView: this.user?.phone?.number || ''});
    this.checkVerifiedPhone();
  })
  this.personalSettingsForm.patchValue({email: this.user?.email || ''})
  this.personalViewForm.patchValue({emailView: this.user?.email || ''})
  this.personalSettingsForm.patchValue({phone: this.user?.phone?.number || ''})
  this.personalViewForm.patchValue({phoneView: this.user?.phone?.number || ''})
}

async deleteAccount() {
  this.confirmDeleteAccount();
}


private confirmDeleteAccount() {
  this.loading.showLoading().then(loader => {
    this.userService.deleteUser().pipe(
      finalize(() => this.loading.hideLoading(loader))
    ).subscribe({
      next: () => {
        this.toastService.showToast('Аккаунт успешно удален', 'success');
        // Выходим из аккаунта
    
        setTimeout(()=>{
              // Перенаправляем на страницу авторизации
          this.navController.navigateRoot('/select-auth');
        },0)
        if(this.userService.user.value){
          this.userService.deleteUserInUsersArrayInLocalStorage(this.userService.user.value)
        }

        this.authService.logout();
        
      },
      error: (error) => {
        console.error('Ошибка при удалении аккаунта:', error);
        this.toastService.showToast('Ошибка при удалении аккаунта', 'danger');
      }
    });
  });
}

}
