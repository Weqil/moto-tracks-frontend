import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component';

@Component({
  selector: 'app-track-section',
  templateUrl: './track-section.component.html',
  styleUrls: ['./track-section.component.scss'],
  imports: [CheckImgUrlPipe,CheckImgUrlPipe,CommonModule,SharedModule,IconButtonComponent]
})
export class TrackSectionComponent  implements OnInit {

  constructor() { }
  @Input() hidhtStatus!:boolean
  @Input() track!:Track
  @Input() loading!:boolean
  checkImage(){
    
  }

  ionViewWillEnter(){
    
  }

  ngOnInit() {}

}
