import { Component, inject, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-confirm-email-page',
  templateUrl: './confirm-email-page.component.html',
  styleUrls: ['./confirm-email-page.component.scss'],
  imports:[SharedModule,HeaderModule,NgxOtpInputComponent,ButtonsModule,NgClass]
})
export class ConfirmEmailPageComponent  implements OnInit {

  constructor() { }
  userService: UserService = inject(UserService)
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength:4,
  }
  timerActive: boolean = false
  user!: User
  ionViewWillEnter() {
    this.user = this.userService.getUserFromLocalStorage()
  }
  ngOnInit() {}

}
