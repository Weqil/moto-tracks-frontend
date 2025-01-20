import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { selectedModule } from 'src/app/Shared/Modules/selected/selected.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';

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
  
  user: User|null = inject(UserService).user.value 
  authService:AuthService = inject(AuthService)
  navControler:NavController = inject(NavController)

  statusesSelect:boolean = false
  selectedStatusItem:any =  { id: 1, name: 'Гонщик', value: 'Гонщик' }
  statuses:any[] = [
    { id: 1, name: 'Гонщик', value: 'Гонщик' },
    { id: 2, name: 'Организатор', value: 'Организатор' },
  ];

  setNewStatusModalOpen(){
  }
  selectStatus(event:any){
    this.selectedStatusItem = event;
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
  ngOnInit() {
    
  }

}
