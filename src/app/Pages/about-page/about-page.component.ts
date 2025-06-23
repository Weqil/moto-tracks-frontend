import { Component, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  imports: [
     IonContent,
  ],
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
