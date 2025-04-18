import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-linarik-ui',
  templateUrl: './linarik-ui.component.html',
  styleUrls: ['./linarik-ui.component.scss'],
  imports:[
    IonContent,
    IconButtonComponent,
    BackButtonComponent
  ]
})
export class LinarikUiComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
