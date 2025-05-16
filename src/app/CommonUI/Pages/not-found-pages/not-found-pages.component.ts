import { Component, inject, OnInit } from '@angular/core';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonModal, NavController, Platform } from '@ionic/angular/standalone';
@Component({
  selector: 'app-not-found-pages',
  templateUrl: './not-found-pages.component.html',
  styleUrls: ['./not-found-pages.component.scss'],
  imports:[IconButtonComponent]
})
export class NotFoundPagesComponent  implements OnInit {

  constructor() { }
  navController:NavController = inject(NavController);
  ngOnInit() {}

  back(){
    this.navController.navigateForward('')
  }

}
