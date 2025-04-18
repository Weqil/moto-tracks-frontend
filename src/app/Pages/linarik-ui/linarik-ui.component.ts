import { Component, OnInit } from '@angular/core';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-linarik-ui',
  templateUrl: './linarik-ui.component.html',
  styleUrls: ['./linarik-ui.component.scss'],
  imports:[
    IonContent,
    IconButtonComponent
  ]
})
export class LinarikUiComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
