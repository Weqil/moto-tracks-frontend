import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { CheckBoxComponent } from '@app/Shared/Components/UI/LinarikUI/forms/check-box/check-box.component';
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';
import { SelectBottomModalComponent } from '@app/Shared/Components/UI/LinarikUI/select-bottom-modal/select-bottom-modal.component';

import { TabElementComponent } from '@app/Shared/Components/UI/LinarikUI/tabs/tab-element/tab-element.component';
import { TabMenuItemComponent } from '@app/Shared/Components/UI/LinarikUI/tabs/tab-menu-item/tab-menu-item.component';
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { NavbarVisibleService } from '@app/Shared/Services/navbar-visible.service';
import { IonContent } from "@ionic/angular/standalone";
import { UserSectionComponent } from "../../Shared/Components/UserElements/user-section/user-section.component";
import { StandartRichInputComponent } from "../../Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component";

@Component({
  selector: 'app-linarik-ui',
  templateUrl: './linarik-ui.component.html',
  styleUrls: ['./linarik-ui.component.scss'],
  imports: [
    IonContent,
    IconButtonComponent,
    BackButtonComponent,
    CheckBoxComponent,
    CommonModule,
    TabMenuItemComponent,
    TabElementComponent,
    SelectBottomModalComponent,
    StandartInputComponent,
    UserSectionComponent,
    StandartRichInputComponent
]
})
export class LinarikUiComponent  implements OnInit {

  constructor() { }
  activeTab:boolean = false
  selectModalState:boolean = false
  selectRegionModalState:boolean = false
  form = new FormGroup({
    text: new FormControl(),
    searchRegion: new FormControl(),
  })
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
  regions = [
    { id: 1, name: "Республика Адыгея", type: "республика" },
    { id: 2, name: "Республика Башкортостан", type: "республика" },
    { id: 3, name: "Республика Бурятия", type: "республика" },
    { id: 4, name: "Республика Алтай", type: "республика" },
    { id: 5, name: "Республика Дагестан", type: "республика" },
    { id: 6, name: "Республика Ингушетия", type: "республика" },
    { id: 7, name: "Кабардино-Балкарская Республика", type: "республика" },
    { id: 8, name: "Республика Калмыкия", type: "республика" },
    { id: 9, name: "Карачаево-Черкесская Республика", type: "республика" },
    { id: 10, name: "Республика Карелия", type: "республика" },
    { id: 11, name: "Республика Коми", type: "республика" },
    { id: 12, name: "Республика Марий Эл", type: "республика" },
    { id: 13, name: "Республика Мордовия", type: "республика" },
    { id: 14, name: "Республика Саха (Якутия)", type: "республика" },
    { id: 15, name: "Республика Северная Осетия — Алания", type: "республика" },
    { id: 16, name: "Республика Татарстан", type: "республика" },
    { id: 17, name: "Республика Тыва", type: "республика" },
    { id: 18, name: "Удмуртская Республика", type: "республика" },
    { id: 19, name: "Республика Хакасия", type: "республика" },
    { id: 20, name: "Чеченская Республика", type: "республика" },
    { id: 21, name: "Чувашская Республика", type: "республика" },
    { id: 22, name: "Алтайский край", type: "край" },
    { id: 23, name: "Забайкальский край", type: "край" },
    { id: 24, name: "Камчатский край", type: "край" },
    { id: 25, name: "Краснодарский край", type: "край" },
    { id: 26, name: "Красноярский край", type: "край" },
    { id: 27, name: "Пермский край", type: "край" },
    { id: 28, name: "Приморский край", type: "край" },
    { id: 29, name: "Ставропольский край", type: "край" },
    { id: 30, name: "Хабаровский край", type: "край" },
    { id: 31, name: "Амурская область", type: "область" },
    { id: 32, name: "Архангельская область", type: "область" },
    { id: 33, name: "Астраханская область", type: "область" },
    { id: 34, name: "Белгородская область", type: "область" },
    { id: 35, name: "Брянская область", type: "область" },
    { id: 36, name: "Владимирская область", type: "область" },
    { id: 37, name: "Волгоградская область", type: "область" },
    { id: 38, name: "Вологодская область", type: "область" },
    { id: 39, name: "Воронежская область", type: "область" },
    { id: 40, name: "Ивановская область", type: "область" },
    { id: 41, name: "Иркутская область", type: "область" },
    { id: 42, name: "Калининградская область", type: "область" },
    { id: 43, name: "Калужская область", type: "область" },
    { id: 44, name: "Кемеровская область", type: "область" },
    { id: 45, name: "Кировская область", type: "область" },
    { id: 46, name: "Костромская область", type: "область" },
    { id: 47, name: "Курганская область", type: "область" },
    { id: 48, name: "Курская область", type: "область" },
    { id: 49, name: "Ленинградская область", type: "область" },
    { id: 50, name: "Липецкая область", type: "область" },
    { id: 51, name: "Магаданская область", type: "область" },
    { id: 52, name: "Московская область", type: "область" },
    { id: 53, name: "Мурманская область", type: "область" },
    { id: 54, name: "Нижегородская область", type: "область" },
    { id: 55, name: "Новгородская область", type: "область" },
    { id: 56, name: "Новосибирская область", type: "область" },
    { id: 57, name: "Омская область", type: "область" },
    { id: 58, name: "Оренбургская область", type: "область" },
    { id: 59, name: "Орловская область", type: "область" },
    { id: 60, name: "Пензенская область", type: "область" },
    { id: 61, name: "Псковская область", type: "область" },
    { id: 62, name: "Ростовская область", type: "область" },
    { id: 63, name: "Рязанская область", type: "область" },
    { id: 64, name: "Самарская область", type: "область" },
    { id: 65, name: "Саратовская область", type: "область" },
    { id: 66, name: "Сахалинская область", type: "область" },
    { id: 67, name: "Свердловская область", type: "область" },
    { id: 68, name: "Смоленская область", type: "область" },
    { id: 69, name: "Тамбовская область", type: "область" },
    { id: 70, name: "Тверская область", type: "область" },
    { id: 71, name: "Томская область", type: "область" },
    { id: 72, name: "Тульская область", type: "область" },
    { id: 73, name: "Тюменская область", type: "область" },
    { id: 74, name: "Ульяновская область", type: "область" },
    { id: 75, name: "Челябинская область", type: "область" },
    { id: 76, name: "Ярославская область", type: "область" },
    { id: 77, name: "г. Москва", type: "город федерального значения" },
    { id: 78, name: "г. Санкт-Петербург", type: "город федерального значения" },
    { id: 79, name: "г. Севастополь", type: "город федерального значения" },
    { id: 80, name: "Еврейская автономная область", type: "автономная область" },
    { id: 81, name: "Ненецкий автономный округ", type: "автономный округ" },
    { id: 82, name: "Ханты-Мансийский автономный округ — Югра", type: "автономный округ" },
    { id: 83, name: "Чукотский автономный округ", type: "автономный округ" },
    { id: 84, name: "Ямало-Ненецкий автономный округ", type: "автономный округ" }
  ];
  user:any = {
    "id": 3,
    "name": "arsipooshka@gmail.com",
    "email": "arsipooshka@gmail.com",
    "email_verified_at": "2025-01-29T13:10:00.000000Z",
    "avatar": "user/3/mV3lVbsOOUDkgCU9K6ZSBi8gboseaQBsE756VuXy.jpg",
    "start_number": "126",
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
      "name": "Иван",
      "surname": "Иванов",
      "patronymic": "Евгеньевич",
      "date_of_birth": "2025-01-18",
      "city": "Екатеринбург",
      "inn": "12321321",
      "snils": 888,
      "phone_number": "9826190989",
      "start_number": 126,
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

  navBarVisibleService:NavbarVisibleService = inject(NavbarVisibleService)
  getCheckBoxValue(event:any){
    let currentItem = this.checkBoxArray.find((box:any)=> event.value == box.value )
    currentItem.state = !event.state
  }
  openModal(){
    this.selectModalState = true
    this.navBarVisibleService.hideNavBar()
  }
  closeModal(){
    this.selectModalState = false
    setTimeout(()=>{
      this.navBarVisibleService.showNavBar()
    },100)
 
  }
  openRegionModal(){
    this.selectRegionModalState = true
    this.navBarVisibleService.hideNavBar()
  }
  closeRegionModal(){
    this.selectRegionModalState = false
    setTimeout(()=>{
      this.navBarVisibleService.showNavBar()
    },100)
 
  }

  changeTab(event:any){
    this.activeTab = !event.state
  }

  
}
