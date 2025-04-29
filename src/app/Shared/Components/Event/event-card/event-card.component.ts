import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { NavController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import moment from 'moment';
import { UsersPluralRulePipe } from "../../../Helpers/users-plural-rule.pipe";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [CheckImgUrlPipe, DatePipe, CommonModule, UsersPluralRulePipe],
})
export class EventCardComponent  implements OnInit {
  @Input() event!:IEvent
  navController:NavController = inject(NavController)
  constructor() { }

  registrationStatus:boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    this.registrate()
    
  }
  formatDate(dateString: string): string {
    return moment(dateString).format('D MMMM YYYY');
  }

  registrate() {
    const recordStart = moment(this.event.record_start);
    const recordEnd = moment(this.event.record_end);
    const now = moment();
    this.registrationStatus = now <= recordEnd && now >= recordStart
  }

  redirectInTrack(){
    this.navController.navigateForward(`/track/${this.event.track.id}`)
  }
  redirectInEvent(){
    this.navController.navigateForward(`/event/${this.event.id}`)
  }
  ngOnInit() {
    
  }

}
