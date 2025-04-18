import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { CheckBoxComponent } from '@app/Shared/Components/UI/LinarikUI/forms/check-box/check-box.component';
import { TabMenuItemComponent } from '@app/Shared/Components/UI/LinarikUI/tabs/tab-menu-item/tab-menu-item.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-linarik-ui',
  templateUrl: './linarik-ui.component.html',
  styleUrls: ['./linarik-ui.component.scss'],
  imports:[
    IonContent,
    IconButtonComponent,
    BackButtonComponent,
    CheckBoxComponent,
    CommonModule,
    TabMenuItemComponent
  ]
})
export class LinarikUiComponent  implements OnInit {

  constructor() { }
  checkBoxArray:any = [
    {
      value:1,
      state:false,
      labelText:'Кубок',
      theme:'gray',
      clippy:'clippy-right'
    },
    {
      value:2,
      state:false,
      labelText:'Кубок',
      theme:'white',
      clippy:'clippy-right'
    },
    {
      value:3,
      state:false,
      labelText:'Освещение',
      theme:'red',
      clippy:''
    },
    {
      value:4,
      state:false,
      labelText:'Освещение',
      theme:'white',
      clippy:''
    },

  ]
  ngOnInit() {}


  getCheckBoxValue(event:any){
    let currentItem = this.checkBoxArray.find((box:any)=> event.value == box.value )
    currentItem.state = !event.state
  }
}
