import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandartInputComponent } from '../../Components/Forms/standart-input/standart-input.component';
import { StandartRichInputComponent } from '../../Components/Forms/standart-rich-input/standart-rich-input.component';
import { AddressInputComponent } from '../../Components/Forms/address-input/address-input.component';
import { FileInputComponent } from '../../Components/Forms/file-input/file-input.component';
import { StandartInputSearchComponent } from '../../Components/Forms/standart-input-search/standart-input-search.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StandartInputComponent,
    StandartRichInputComponent,
    AddressInputComponent,
    FileInputComponent,
    StandartInputSearchComponent
    
  ],
  exports: [
    StandartInputComponent,
    StandartRichInputComponent,
    FileInputComponent,
    StandartInputSearchComponent
  ]
})
export class FormsModule { }
