import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-distribution-agreement',
  templateUrl: './distribution-agreement.component.html',
  styleUrls: ['./distribution-agreement.component.scss'],
  imports:[HeaderModule, IonicModule]
})
export class DistributionAgreementComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
