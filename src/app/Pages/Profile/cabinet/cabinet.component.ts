import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ProfileModule } from 'src/app/Shared/Modules/user/profile.module';
import { UserModule } from 'src/app/Shared/Modules/user/user.module';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  imports:[
    SharedModule,
    HeaderModule,
    UserModule,
    ProfileModule
  ]
})
export class CabinetComponent  implements OnInit {
  
  user: User|null = inject(UserService).user.value 
  
  constructor() { }

  ngOnInit() {
    console.log(this.user)
  }

}
