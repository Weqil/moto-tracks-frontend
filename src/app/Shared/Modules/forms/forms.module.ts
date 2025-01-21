import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandartInputComponent } from '../../Components/Forms/standart-input/standart-input.component';
import { StandartRichInputComponent } from '../../Components/Forms/standart-rich-input/standart-rich-input.component';
import { AddressInputComponent } from '../../Components/Forms/address-input/address-input.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StandartInputComponent,
    StandartRichInputComponent,
    AddressInputComponent
  ],
  exports: [
    StandartInputComponent
  ]
})
export class FormsModule { }
