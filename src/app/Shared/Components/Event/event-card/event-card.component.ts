import { Component, inject, Input, OnInit } from '@angular/core';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [CheckImgUrlPipe],
})
export class EventCardComponent  implements OnInit {
  @Input() event!:IEvent
  navController:NavController = inject(NavController)
  constructor() { }

  redirectInTrack(){
    this.navController.navigateForward(`/track/${this.event.track.id}`)
  }
  redirectInEvent(){
    this.navController.navigateForward(`/event/${this.event.id}`)
  }
  ngOnInit() {}

}
