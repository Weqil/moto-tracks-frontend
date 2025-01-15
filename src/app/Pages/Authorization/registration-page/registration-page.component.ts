import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
  imports: [SharedModule, HeaderModule]
})
export class RegistrationPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
