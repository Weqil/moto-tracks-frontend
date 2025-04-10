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
import { NoDataFoundComponent } from 'src/app/Shared/Components/UI/no-data-found/no-data-found.component';
import { NgZone } from '@angular/core';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';
import { selectedModule } from "../../../Shared/Modules/selected/selected.module";
import { catchError, EMPTY, finalize, throwError } from 'rxjs';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { NavController } from '@ionic/angular';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { IonCheckbox, IonModal, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule, 
    CommonModule, 
    HeaderModule, 
    FormsModule, 
    UserModule,
    ProfileModule, 
    selectedModule, 
    IonModal, 
    IonCheckbox, 
    RouterLink, 
    StandartInputComponent,
    NoDataFoundComponent,
    
  ],
  standalone: true
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
  emailModalValue:boolean = false

  personalSettingsForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
   
  })

  personalViewForm: FormGroup = new FormGroup({
    
    emailView: new FormControl('', [Validators.required]),
  })

  openEmailModal(){
    this.emailModalValue = true
  }
  closeEmailModal(){
    this.emailModalValue = false
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
    name: {
      errorMessage:''

    },
    email: {
       errorMessage:''
    },
   
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
   
    this.closeEmailModal();
    this.userService.refreshUser(() => {
      this.personalViewForm.patchValue({ emailView: this.personalSettingsForm.get('email')?.value });
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
  this.navController.navigateRoot('/verification');
}

  avatarUrl:string = ''

 
  settingsAvatar:string = ''
  userSettingsForm: FormGroup = new FormGroup({
    avatar: new FormControl('', [Validators.required])
  })


  user!:User|null

  selectStatus(event:any){
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
      this.toastService.showToast('Изменения сохранены','success')
      this.userService.refreshUser()
      this.navControler.navigateForward(['/cabinet'])
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
      // this.selectedStatusItem = this.user?.roles[0].name
    })
  }

  closeModalAgreedNotVerificated(){
    this.userAgreedStatus = 'false'
    this.userAgreedModalState = false
  }

  ionViewDidLeave(){
    this.userAgreedModalState = false
  }

  

  ngOnInit() { 
    
    window.addEventListener('popstate', (event) => {
      this.closeEmailModal()
    });
    
    this.userService.user.pipe().subscribe(()=>{
    this.user = this.userService.user.value 
  })
  this.personalSettingsForm.patchValue({email: this.user?.email})
  this.personalViewForm.patchValue({emailView: this.user?.email})
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
          this.navController.navigateRoot('/login');
        },0)
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
