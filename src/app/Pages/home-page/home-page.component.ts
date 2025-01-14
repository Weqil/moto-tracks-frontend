import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [SharedModule, ButtonsModule],
  providers:[
    SharedModule,
    ButtonsModule
  ]

})
export class HomePageComponent  implements OnInit {

  constructor() { }
  ngOnInit() {}

}
