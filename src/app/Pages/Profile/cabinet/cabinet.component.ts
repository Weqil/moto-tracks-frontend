import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  imports:[
    SharedModule
  ]
})
export class CabinetComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
