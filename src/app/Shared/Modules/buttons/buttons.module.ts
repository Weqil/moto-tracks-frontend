import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../Components/UI/Buttons/back-button/back-button.component';
import { CircleButtonComponent } from '../../Components/UI/Buttons/circle-button/circle-button.component';
import { StandartButtonComponent } from '../../Components/UI/Buttons/standart-button/standart-button.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
    CircleButtonComponent,
    StandartButtonComponent

  ],
  exports: [BackButtonComponent, CircleButtonComponent, StandartButtonComponent]
})
export class ButtonsModule { }
