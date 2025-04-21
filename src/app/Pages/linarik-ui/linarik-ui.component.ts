import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { CheckBoxComponent } from '@app/Shared/Components/UI/LinarikUI/forms/check-box/check-box.component';
import { SelectBottomModalComponent } from '@app/Shared/Components/UI/LinarikUI/select-bottom-modal/select-bottom-modal.component';

import { TabElementComponent } from '@app/Shared/Components/UI/LinarikUI/tabs/tab-element/tab-element.component';
import { TabMenuItemComponent } from '@app/Shared/Components/UI/LinarikUI/tabs/tab-menu-item/tab-menu-item.component';
import { User } from '@app/Shared/Data/Interfaces/user-model';
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
    TabMenuItemComponent,
    TabElementComponent,
    SelectBottomModalComponent,
  ]
})
export class LinarikUiComponent  implements OnInit {

  constructor() { }
  activeTab:boolean = false
  selectModalState:boolean = false
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
  user:any = {
    "id": 3,
    "name": "arsipooshka@gmail.com",
    "email": "arsipooshka@gmail.com",
    "email_verified_at": "2025-01-29T13:10:00.000000Z",
    "avatar": "user/3/mV3lVbsOOUDkgCU9K6ZSBi8gboseaQBsE756VuXy.jpg",
    "roles": [
      {
        "id": 3,
        "name": "Rider"
      },
      {
        "id": 4,
        "name": "Organization"
      },
      {
        "id": 5,
        "name": "Commission"
      },
      {
        "id": 6,
        "name": "Couch"
      }
    ],
    "personal": {
      "name": "Пётр11",
      "surname": "Nвапвапва",
      "patronymic": "Евгеньевич",
      "date_of_birth": "2025-01-18",
      "city": "Челябинская Область",
      "inn": "12321321",
      "snils": 888,
      "phone_number": "9826190989",
      "start_number": "126",
      "group": "1B",
      "rank_number": '',
      "rank": "МС",
      "community": "Новая команда",
      "coach": '',
      "moto_stamp": "Kaw",
      "engine": "4Т",
      "number_and_seria": "12312312312321",
      "region": "Бурятия республика",
      "location": {
        "id": '10',
        "name": "Бурятия",
      },
      "command": {
        "id": 71,
        "name": "Новая команда",
        "full_name": '',
        "coach": '',
        "city": "Калуга",
        "avatar": ''
      }
    },
    
  }
  ngOnInit() {}


  getCheckBoxValue(event:any){
    let currentItem = this.checkBoxArray.find((box:any)=> event.value == box.value )
    currentItem.state = !event.state
  }
  openModal(){
    this.selectModalState = true
  }
  closeModal(){
    this.selectModalState = false
  }

  changeTab(event:any){
    this.activeTab = !event.state
  }
}
