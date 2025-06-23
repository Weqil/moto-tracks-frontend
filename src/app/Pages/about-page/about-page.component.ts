import { Component, inject, OnInit } from '@angular/core';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonModal, NavController } from '@ionic/angular/standalone';

import { IonContent } from "@ionic/angular/standalone";
@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  imports: [
     IonContent,
     IconButtonComponent
  ],
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent  implements OnInit {

  constructor() { }
  navController = inject(NavController);
  
  redirectInSelectAuth(){
    this.navController.navigateForward('/select-auth');
  }
  redirectInLink(link:string){
    let links:any = {
      tg:'https://t.me/mototrackapp',
      google: 'https://play.google.com/store/apps/details?id=com.policam.motokros',
      appStore: 'https://apps.apple.com/us/app/%D0%BC%D0%BE%D1%82%D0%BE%D0%BA%D1%80%D0%BE%D1%81c/id6741205282',
      ruStore:'https://www.rustore.ru/catalog/app/com.policam.motokros'
    }
    if (links[link]) {
      window.open(links[link], '_blank');
    } else {
      console.error('Invalid link:', link);
    }
  }
  ngOnInit() {}

}
