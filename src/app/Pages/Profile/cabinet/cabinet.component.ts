import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  imports:[
    SharedModule,
    HeaderModule
  ]
})
export class CabinetComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
