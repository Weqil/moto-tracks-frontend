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
import { TabsComponent } from "../../../Shared/Components/UI/tabs/tabs.component";
import { TabsItemComponent } from "../../../Shared/Components/UI/tabs-item/tabs-item.component";

import moment from 'moment';


@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule, CommonModule, HeaderModule, EventModule, IonModal, TabsComponent, TabsItemComponent]
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
 

  

  redirectInTracks(){
    this.navController.navigateForward('/tracks')
  }

  closetTableModal(){
    this.tableModalValue = false
  }

  generateGoogleLink(eventId:any){
    this.loadingService.showLoading()
    this.eventService.generateGoogleLink(eventId).pipe(
      finalize(()=>
         this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.tableModalValue = true
      this.googleTabsLink = res.table_url
    })
  }

  ionViewWillEnter(){
    this.loadingService.showLoading()
    this.switchTypeService.setTypeInLocalSorage('events')
    this.eventService.getAllEvents({dateStart:moment().format('YYYY-MM-DD')}).pipe(
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any) => {
        this.eventTapeService.events = res.races
    })
  }
 
  ngOnInit() {}

}
