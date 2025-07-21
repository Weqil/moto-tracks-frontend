import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from 'src/app/CommonUI/Interfaces/navigation-link';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { IconButtonComponent } from "../LinarikUI/buttons/icon-button/icon-button.component";
import {UserService} from "@app/Shared/Data/Services/User/user.service";
import {AuthService} from "@app/Shared/Data/Services/Auth/auth.service";
import {NavController} from "@ionic/angular";


@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule,
    IconButtonComponent
]
})

export class BottomNavComponent  {

  @Input() links!: Link[]
  @Input() header: boolean = false
  @Output() linkChanged: EventEmitter<Link> = new EventEmitter();
  userService: UserService = inject(UserService)
  authService: AuthService = inject(AuthService)
  navControler: NavController = inject(NavController)

  constructor() { }

  //Отправляю ссылку
  handleLinkClick(link: Link){
    this.linkChanged.emit(link);
  }

  logoutInAccount() {
    let user = this.userService.user.value
    if (user) {
      this.userService.deleteUserInUsersArrayInLocalStorage(user)
    }

    this.authService.logout()
    this.navControler.navigateForward('/select-auth',{  animated: false })
  }

  ionViewWillEnter(){

  }


  loginInAccount() {
    this.navControler.navigateForward('/select-auth',{  animated: false })
  }
}
