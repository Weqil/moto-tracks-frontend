import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.scss'],
  imports: [SharedModule,ButtonsModule,HeaderModule,EventModule]
})
export class MyEventsPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  events!:any
  userService: UserService = inject(UserService)
  redirectInCreate(){
    this.navController.navigateForward('/create-event')
  }

  ionViewWillEnter(){
    this.eventService.getEventByUserId(String(this.userService.user.value?.id)).pipe().subscribe((res:any)=>{
      this.events = res.races
    })
  }
  ngOnInit() {}

}
