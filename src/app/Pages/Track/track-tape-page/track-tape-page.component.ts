import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
@Component({
  selector: 'app-track-tape-page',
  templateUrl: './track-tape-page.component.html',
  styleUrls: ['./track-tape-page.component.scss'],
  imports: [SharedModule,HeaderModule,ButtonsModule]
})
export class TrackTapePageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
