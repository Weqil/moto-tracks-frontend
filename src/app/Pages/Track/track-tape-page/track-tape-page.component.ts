import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { TrackGridComponent } from "../../../Shared/Components/Track/track-grid/track-grid.component";
@Component({
  selector: 'app-track-tape-page',
  templateUrl: './track-tape-page.component.html',
  styleUrls: ['./track-tape-page.component.scss'],
  imports: [SharedModule, HeaderModule, ButtonsModule, TrackModule]
})
export class TrackTapePageComponent  implements OnInit {

  constructor() { }
  tracks: Track[] = [
    {
      id: 1,
      name: 'Баженово',
      address:'Свердловская область, поселок городского типа Белоярский, посёлок Баженово',
      latitude:56.728396,
      longitude:61.388896
    },
    {
      id: 2,
      name: 'UctusMoto',
      address:'Свердловская область, поселок городского типа Белоярский, посёлок Баженово',
      latitude:56.728396,
      longitude:61.388896
    },
  ]

  getTracks(){
    console.log('конец срола')
  }

  ngOnInit() {}

}
