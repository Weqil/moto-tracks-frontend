import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { selectedModule } from 'src/app/Shared/Modules/selected/selected.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports:[
    SharedModule,
    HeaderModule,
    UserModule,
    ProfileModule,
    ButtonsModule,
    selectedModule
  ]
})
export class CabinetComponent  implements OnInit {
  
  user!: User|null 
  userService: UserService = inject(UserService)
  authService:AuthService = inject(AuthService)
  navControler:NavController = inject(NavController)

  private readonly loading:LoadingService = inject(LoadingService)

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
    this.selectedStatusItem = this.user?.roles[0];
    console.log( this.selectedStatusItem)
  }
  openSelectedStatus(){
    this.statusesSelect = true;
  }
  closeSelectedStatus(){
    this.statusesSelect = false;
  }
  constructor() { }
  logoutInAccount() {
    this.authService.logout()
    this.navControler.navigateForward('/login',{  animated: false })
  }
  redirectInEditPersonalInfo(){
    this.navControler.navigateForward('/personal-info')
  }
  ionViewWillEnter(){
    this.selectedStatusItem = this.user?.roles[0];
  }
  ngOnInit() {
    this.userService.user.pipe().subscribe(()=>{
      this.user = this.userService.user.value 
    })
  }

}
