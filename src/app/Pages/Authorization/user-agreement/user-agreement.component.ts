import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonContent } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss'],
  imports:[HeaderModule, IonicModule]
})
export class UserAgreementComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
