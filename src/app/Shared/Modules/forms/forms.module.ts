import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandartInputComponent } from '../../Components/Forms/standart-input/standart-input.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StandartInputComponent
  ],
  exports: [
    StandartInputComponent
  ]
})
export class FormsModule { }
