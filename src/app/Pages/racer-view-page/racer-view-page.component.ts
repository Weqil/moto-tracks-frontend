import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Racer } from 'src/app/Shared/Data/Interfaces/user-model';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';

@Component({
  selector: 'app-racer-view-page',
  templateUrl: './racer-view-page.component.html',
  styleUrls: ['./racer-view-page.component.scss'],
  imports: [SharedModule,SlidersModule,ButtonsModule]
})
export class RacerViewPageComponent  implements OnInit {
  racer:Racer = {
    id: 1,
    name: 'Кирилл Беляков',
    images:['https://pp.userapi.com/vQch9xWI_w9F4Xi0ubAIwoZRYzDa7brA-6uJKQ/SFvvlwAbNbk.jpg'],
    address:'Заречный, Свердловская обл.',
    start_number:125,
    rewards:[{name:'Чемпионат ярославской  области', icon:'/assets/icons/medal.svg'}, {name:'Туринский мотокрос 2024', icon:'/assets/icons/medal.svg'}, {name:'Туринский мотокрос 2025', icon:'/assets/icons/medal.svg'}]
  }
  constructor() { }
  ionViewWillEnter(){
  }
  ngOnInit() {}

}
