import { Component, inject, Input, OnInit } from '@angular/core';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { NavController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [CheckImgUrlPipe, DatePipe,CommonModule],
})
export class EventCardComponent  implements OnInit {
  @Input() event!:IEvent
  navController:NavController = inject(NavController)
  constructor() { }

  registrationStatus:boolean = false

  formatDate(dateString: string): string {
    return moment(dateString).format('DD.MM.YYYY');
  }

  registrate() {
    const recordStart = moment(this.event.record_start);
    const recordEnd = moment(this.event.record_end);
    const now = moment();
  
     if(now.isBetween(recordStart, recordEnd, undefined, '()')){
      this.registrationStatus = true
     };
    
  }

  redirectInTrack(){
    this.navController.navigateForward(`/track/${this.event.track.id}`)
  }
  redirectInEvent(){
    this.navController.navigateForward(`/event/${this.event.id}`)
  }
  ngOnInit() {
    this.registrate()
  }

}
