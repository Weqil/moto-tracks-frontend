import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { NavController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import moment from 'moment';
import { UsersPluralRulePipe } from "../../../Helpers/users-plural-rule.pipe";
import { IconButtonComponent } from "../../UI/LinarikUI/buttons/icon-button/icon-button.component";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [CheckImgUrlPipe, DatePipe, CommonModule, UsersPluralRulePipe, IconButtonComponent],
})
export class EventCardComponent  implements OnInit {
  @Input() event!:IEvent
  navController:NavController = inject(NavController)
  constructor() { }

  registrationStatus:boolean = false

  ngOnChanges(changes: SimpleChanges): void {
    this.registrate()
    
  }
  formatDate(dateString: string, noYear?:boolean): string {
    if(noYear){
      return moment(dateString).format('D.MM  HH:MM');
    }
    return moment(dateString).format('D MMMM YYYY');
  }

  registrate() {
    const recordStart = moment(this.event.record_start);
    const recordEnd = moment(this.event.record_end);
    const now = moment();
    this.registrationStatus = now <= recordEnd && now >= recordStart
  }

  get formatingDate():string|boolean{
  
    if(!this.event.record_start){
      return false
    }
    return this.event.record_start &&  !this.event.record_end ? `с ${this.formatDate(this.event.record_start,true)}` : `с ${this.formatDate(this.event.record_start,true)} по ${this.formatDate(String(this.event.record_end),true)}`
  }

  get checkRecord():string{
    
    const recordStart = moment(this.event.record_start);
    const recordEnd = moment(this.event.record_end);
    const now = moment();
    if(!this.event.record_start){
      return 'Регистрация закрыта'
    }
    if(!this.registrationStatus){
      if(now > recordEnd){
        return 'Регистрация закрыта'
      }
      if(now < recordStart){
        return `Регистрация с ${recordStart.format('DD.MM HH:mm')}`
      }
    }
    return 'Регистрация открыта'
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
