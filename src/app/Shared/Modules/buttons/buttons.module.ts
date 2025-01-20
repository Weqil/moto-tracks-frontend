import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../Components/UI/Buttons/back-button/back-button.component';
import { CircleButtonComponent } from '../../Components/UI/Buttons/circle-button/circle-button.component';
import { StandartButtonComponent } from '../../Components/UI/Buttons/standart-button/standart-button.component';
import { SwitcherComponent } from '../../Components/UI/Buttons/switcher/switcher.component';
import { RoundedButtonComponent } from '../../Components/UI/Buttons/rounded-button/rounded-button.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
    CircleButtonComponent,
    StandartButtonComponent,
    SwitcherComponent,
    RoundedButtonComponent

  ],
  exports: [BackButtonComponent, CircleButtonComponent, StandartButtonComponent,SwitcherComponent]
})
export class ButtonsModule { }
