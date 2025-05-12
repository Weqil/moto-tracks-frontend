import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
import { IonModal, NavController, Platform } from '@ionic/angular/standalone';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-select-auth-page',
  templateUrl: './select-auth-page.component.html',
  styleUrls: ['./select-auth-page.component.scss'],
  imports:[IconButtonComponent,CommonModule,IonContent,BackButtonComponent]
})
export class SelectAuthPageComponent  implements OnInit {

  constructor() { }

  navController: NavController = inject(NavController) 

  back(){
    this.navController.back()
  }
  inLogin(){
    this.navController.navigateForward('/login')
  }
  inRegistration(){
    this.navController.navigateForward('/registration')
  }
  ngOnInit() {}

}
