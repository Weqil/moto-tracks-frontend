import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { EventTapeService } from 'src/app/Shared/Data/Services/Event/event-tape.service';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';


@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule,CommonModule, HeaderModule, ButtonsModule, EventModule, IonModal]
})
export class EventsTapePageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  loadingService:LoadingService = inject(LoadingService)
  eventTapeService: EventTapeService = inject(EventTapeService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  userService: UserService = inject(UserService)
  tableModalValue:boolean = false
  googleTabsLink:string = ''
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

  

  redirectInTracks(){
    this.navController.navigateForward('/tracks')
  }

  generateGoogleLink(eventId:any){
    this.loadingService.showLoading()
    this.eventService.generateGoogleLink(eventId).pipe(
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.tableModalValue = true
      this.googleTabsLink = res.table_url
    })
  }

  ionViewWillEnter(){
    this.loadingService.showLoading()
    this.switchTypeService.setTypeInLocalSorage('events')
    this.eventService.getAllEvents().pipe(
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any) => {
        this.eventTapeService.events = res.races
    })
  }
 
  ngOnInit() {}

}
