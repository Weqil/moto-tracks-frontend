import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.scss'],
  imports: [SharedModule,ButtonsModule,HeaderModule]
})
export class MyEventsPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  redirectInCreate(){
    this.navController.navigateForward('/create-event')
  }
  ngOnInit() {}

}
