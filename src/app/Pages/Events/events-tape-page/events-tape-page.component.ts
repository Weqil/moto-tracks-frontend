import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { EventTapeService } from 'src/app/Shared/Data/Services/Event/event-tape.service';

@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule,CommonModule, HeaderModule, ButtonsModule, EventModule]
})
export class EventsTapePageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  eventTapeService: EventTapeService = inject(EventTapeService)
  testEvent: IEvent = {
    id: 1,
    name: 'Гонка на крутом треке',
    desc:'Ну очень крутая гонка',
    is_work: true,
    date_start:'25-01-2025',
    images:['https://i.ytimg.com/vi/rxudkfHZNBA/maxresdefault.jpg', 'https://motogonki.ru/images/news/30-09-2023_motogp_2023_aleix_espargaro_ustal_ot_problem_s_aprilia.jpg'],
    track:{
      id:16,
      name:'Крутой трек',
      desc:'Очень крутой трек',
      address:'Свердловская область, город Асбест, улица Ленина 22',
      longitude:0,
      latitude:0,
      level: {name:'', color:''}
    }
  }

  

  ionViewWillEnter(){

    this.eventService.getAllEvents().subscribe((res:any) => {
        this.eventTapeService.events = res.races
    })
  }
  redirectInTracks(){
    this.navController.navigateForward('/tracks')
  }
  ngOnInit() {}

}
