import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { RoundedButtonComponent } from "../../../../Shared/Components/UI/Buttons/rounded-button/rounded-button.component";
@Component({
  selector: 'app-my-tracks-page',
  templateUrl: './my-tracks-page.component.html',
  styleUrls: ['./my-tracks-page.component.scss'],
  imports: [SharedModule, HeaderModule, ButtonsModule, RoundedButtonComponent] 
})
export class MyTracksPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
