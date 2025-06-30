import { Component, inject, OnInit, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { UserStatuses } from 'src/app/Shared/Enums/user-status';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { selectedModule } from 'src/app/Shared/Modules/selected/selected.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { CommonModule } from '@angular/common';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { CheckUserRoleService } from '@app/Shared/Data/Services/check-user-role.service';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SportTypesService } from '@app/Shared/Data/Services/sport-types.service';
async function getAppVersion() {
  const platform = Capacitor.getPlatform();
  if (Capacitor.isNativePlatform() || platform == 'ios' || platform == 'android') {
    const info = await App.getInfo();
    return info.version;
  } 
  return false
}
@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule,
    HeaderModule,
    UserModule,
    ProfileModule,
    selectedModule,
    CommonModule,
    CheckImgUrlPipe,
    IconButtonComponent
]
})
export class CabinetComponent  implements OnInit {
  
  user!: User|null 
  userService: UserService = inject(UserService)
  authService:AuthService = inject(AuthService)
  selectedSportName:string|null = localStorage.getItem('contentTypeName')
  sportTypesService: SportTypesService = inject(SportTypesService)
  platform = Capacitor.getPlatform();
  info = ''
  navControler:NavController = inject(NavController)
  userTranslitStatuses:string[] = []
  private readonly loading:LoadingService = inject(LoadingService)

  statusesSelect:boolean = false
  selectedStatusItem!:any 
  allUsers!:Array<User>
  checkUserRole:CheckUserRoleService = inject(CheckUserRoleService)
  selectAccountValue: WritableSignal<boolean> = signal(false)
  version:string = environment.version
  
  checkedUserRole(){

  }

  usersMenuItem:any = {
    [UserStatuses.rider]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
       {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      
    ],
    [UserStatuses.couch]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
      {
        routing:'my-comands',
        iconColor:'#0000',
        icon:'/assets/icons/team.svg',
        iconFilter:'',
        name:'Мои команды'
      },
       {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      
    ],
    [UserStatuses.organizer]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
      {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      {
        routing:'my-tracks',
        iconColor:'#0000',
        icon:'/assets/icons/Repeat.svg',
        iconFilter:'',
        name:'Мои трассы'
      },
      {
        routing:'my-comands',
        iconColor:'#0000',
        icon:'/assets/icons/team.svg',
        iconFilter:'',
        name:'Мои команды'
      }
    ],
    [UserStatuses.administrator]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
      {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      {
        routing:'my-tracks',
        iconColor:'#0000',
        icon:'/assets/icons/Repeat.svg',
        iconFilter:'',
        name:'Мои трассы'
      },
      {
        routing:'my-comands',
        iconColor:'#0000',
        icon:'/assets/icons/team.svg',
        iconFilter:'',
        name:'Мои команды'
      }
    ],
    [UserStatuses.root]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
      {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      {
        routing:'my-tracks',
        iconColor:'#0000',
        icon:'/assets/icons/Repeat.svg',
        iconFilter:'',
        name:'Мои трассы'
      },
      {
        routing:'my-comands',
        iconColor:'#0000',
        icon:'/assets/icons/team.svg',
        iconFilter:'',
        name:'Мои команды'
      }
    ],
    [UserStatuses.commission]:[
      {
        routing:'documents',
        iconColor:'#0000',
        icon:'/assets/icons/documents.svg',
        iconFilter:'',
        name:'Анкета участника'
      },
      {
        routing:'my-events',
        iconColor:'#0000',
        icon:'/assets/icons/FlagStrong.svg',
        iconFilter:'',
        name:'Мои гонки'
      },
      {
        routing:'my-tracks',
        iconColor:'#0000',
        icon:'/assets/icons/Repeat.svg',
        iconFilter:'',
        name:'Мои трассы'
      },
      {
        routing:'my-comands',
        iconColor:'#0000',
        icon:'/assets/icons/team.svg',
        iconFilter:'',
        name:'Мои команды'
      }, 
      {
        routing:'add-users-in-comissions',
        iconColor:'#0000',
        icon:'/assets/icons/star.svg',
        iconFilter:'',
        name:'Назначение судьи'
      }

    ],
  }
  statuses:any[] = [
    { id: 1, name: 'Гонщик', value: 'Гонщик' },
    { id: 2, name: 'Организатор', value: 'Организатор' },
    { id: 3, name: 'Болельщик', value: 'Болельщик' },
    {id:4, name:'Тренер', value: 'Тренер'},
    {id:5, name:'Комиссия', value: 'Комиссия'}

  ];

  setNewStatusModalOpen(){
  }

  


  back(){
    this.navControler.back()
  }
  

  // selectStatus(event:any){
  //   this.searchLastRole()
  //   this.selectedStatusItem = this.searchLastRole()
  // }
  openSelectedStatus(){
    this.statusesSelect = true;
  }
  closeSelectedStatus(){
    this.statusesSelect = false;
  }
  constructor() { }
  logoutInAccount() {
    let user = this.userService.user.value
    if(user){
      this.userService.deleteUserInUsersArrayInLocalStorage(user)
    }
 
    this.authService.logout()
    this.navControler.navigateForward('/select-auth',{  animated: false })
  }
  redirectInEditPersonalInfo(){
    this.navControler.navigateForward('/personal-info')
  }

  selectUserAndRefreshAllData(user:User){
    if(user.access_token){
      this.authService.setAuthToken(user.access_token)
   
    }
    this.selectAccountValue.set(false)
  }

  deleteUserInLocalStorage(user:User){
    this.userService.deleteUserInUsersArrayInLocalStorage(user)
  }

  ionViewWillEnter(){
    getAppVersion().then((res)=>{
      if(!!res){
        this.version = res
      }
    })
    this.allUsers = this.userService.getAllUsersInLocalStorage()
    if(this.allUsers.length){
      let currentUserIndex = this.allUsers.findIndex((user:User)=> user.id === this.userService.user.value?.id)
      let currentUser = this.allUsers[currentUserIndex]
      this.allUsers.splice(currentUserIndex,1)
      this.allUsers.unshift(currentUser)
      this.checkUserRole.searchLastRole()

    }
  }
  navigateInLogin(){
    this.navControler.navigateForward('/select-auth')
  }
  openSelectSportTypesModal(){
      this.sportTypesService.selectSportCategory.next(true)
  }
  ngOnInit() {
    
    this.userService.user.pipe().subscribe((res:any)=>{
      this.user = res
      this.selectedStatusItem = this.checkUserRole.searchLastRole(res)
      this.userTranslitStatuses = this.checkUserRole.getUserRoleNamesInTranslit(res)
      if(this.allUsers && this.allUsers.length){
        let currentUserIndex = this.allUsers.findIndex((user:User)=> user?.id === this.userService.user.value?.id)
        let currentUser = this.allUsers[currentUserIndex]
        this.allUsers.splice(currentUserIndex,1)
        this.allUsers.unshift(currentUser)
      }
      this.allUsers = this.userService.getAllUsersInLocalStorage()
    })

  }

}
