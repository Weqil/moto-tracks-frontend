import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { RoundedButtonComponent } from "../../../../Shared/Components/UI/Buttons/rounded-button/rounded-button.component";
import { NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-my-tracks-page',
  templateUrl: './my-tracks-page.component.html',
  styleUrls: ['./my-tracks-page.component.scss'],
  imports: [SharedModule, HeaderModule, ButtonsModule, RoundedButtonComponent] 
})
export class MyTracksPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  redirectInCreate(){
    this.navController.navigateForward('/create-track')
  }
  ngOnInit() {}

}
