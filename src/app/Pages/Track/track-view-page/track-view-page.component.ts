import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';

@Component({
  selector: 'app-track-view-page',
  templateUrl: './track-view-page.component.html',
  styleUrls: ['./track-view-page.component.scss'],
  imports: [
    SharedModule,
    HeaderModule,
    CheckImgUrlPipe,
    SlidersModule
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
    },
    images:[
      {
        id: 1,
        src: 'https://www.рцпв.рф/wp-content/uploads/2021/03/P6kyiF1u5wI.jpg',
        alt: 'Slide 1',
      },
      {
        src:'https://avatars.mds.yandex.net/i?id=2c610d7df92b855b072023060caa590d_l-5289075-images-thumbs&n=13'
      },
      {
        src:'https://a.d-cd.net/1f13ca9s-960.jpg'
      }
    ]
  }
  constructor() { }

  ngOnInit() {}

}
