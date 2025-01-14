import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [SharedModule],
  providers:[
    SharedModule
  ]

})
export class HomePageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
