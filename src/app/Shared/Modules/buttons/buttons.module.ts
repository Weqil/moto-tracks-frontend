import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleButtonComponent } from '../../Components/UI/Buttons/circle-button/circle-button.component';
import { StandartButtonComponent } from '../../Components/UI/Buttons/standart-button/standart-button.component';
import { SwitcherComponent } from '../../Components/UI/Buttons/switcher/switcher.component';
import { RoundedButtonComponent } from '../../Components/UI/Buttons/rounded-button/rounded-button.component';
import { TypeSwitherComponent } from '../../Components/UI/type-swither/type-swither.component';
import { BackButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/back-button/back-button.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
    CircleButtonComponent,
    StandartButtonComponent,
    SwitcherComponent,
    RoundedButtonComponent,
    TypeSwitherComponent

  ],
  exports: [
    BackButtonComponent, 
    CircleButtonComponent, 
    StandartButtonComponent,
    SwitcherComponent,
    RoundedButtonComponent,
    TypeSwitherComponent
  ]
})
export class ButtonsModule { }
