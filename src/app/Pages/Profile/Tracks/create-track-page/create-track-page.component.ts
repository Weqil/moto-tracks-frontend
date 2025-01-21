import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';

@Component({
  selector: 'app-create-track-page',
  templateUrl: './create-track-page.component.html',
  styleUrls: ['./create-track-page.component.scss'],
  imports: [SharedModule, HeaderComponent, ButtonsModule, StepsModule]
})
export class CreateTrackPageComponent  implements OnInit {

  constructor() { }
  maxStepsCount: number = 2
  stepCurrency: number = 1

  ngOnInit() {}

}
