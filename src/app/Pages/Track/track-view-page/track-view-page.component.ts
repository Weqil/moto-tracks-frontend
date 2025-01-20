import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { CircleButtonComponent } from 'src/app/Shared/Components/UI/Buttons/circle-button/circle-button.component';

@Component({
  selector: 'app-track-view-page',
  templateUrl: './track-view-page.component.html',
  styleUrls: ['./track-view-page.component.scss'],
  imports: [
    SharedModule,
    HeaderModule,
    CheckImgUrlPipe,
    CircleButtonComponent
]
})
export class TrackViewPageComponent  implements OnInit {
  track:Track = {
    id: 1,
    name: 'Баженово',
    address:'Свердловская область, поселок городского типа Белоярский, посёлок Баженово',
    latitude:56.728396,
    longitude:61.388896,
    status:'Работает',
    trackParams:{
      length:2000,
      turn:20,
      level:'Низкая'
    }
  }
  constructor() { }

  ngOnInit() {}

}
