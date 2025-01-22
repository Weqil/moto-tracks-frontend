import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule,CommonModule, HeaderModule, ButtonsModule, EventModule]
})
export class EventsTapePageComponent  implements OnInit {

  constructor() { }
    navController: NavController = inject(NavController)
  redirectInTracks(){
    this.navController.navigateForward('/tracks',)
  }
  ngOnInit() {}

}
