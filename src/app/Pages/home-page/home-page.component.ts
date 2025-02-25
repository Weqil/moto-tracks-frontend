import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [SharedModule, HeaderModule],
  providers:[
    SharedModule,
    ButtonsModule,
    HeaderModule
  ]

})
export class HomePageComponent  implements OnInit {

  constructor() { }
  ngOnInit() {}

}
