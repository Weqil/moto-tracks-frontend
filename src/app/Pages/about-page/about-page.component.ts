import { Component, OnInit } from '@angular/core';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';


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

  ngOnInit() {}

}
