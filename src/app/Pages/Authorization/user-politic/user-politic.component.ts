import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-politic',
  templateUrl: './user-politic.component.html',
  styleUrls: ['./user-politic.component.scss'],
  imports:[HeaderModule, IonicModule]
})
export class UserPoliticComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
