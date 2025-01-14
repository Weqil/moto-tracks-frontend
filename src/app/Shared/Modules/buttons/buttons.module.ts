import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../Components/UI/back-button/back-button.component';
import { CircleButtonComponent } from '../../Components/UI/circle-button/circle-button.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BackButtonComponent,
    CircleButtonComponent
  ],
  exports: [BackButtonComponent, CircleButtonComponent]
})
export class ButtonsModule { }
