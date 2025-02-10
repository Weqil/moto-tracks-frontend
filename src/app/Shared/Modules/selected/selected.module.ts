import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectedComponent } from '../../Components/UI/Selecteds/custom-selected/custom-selected.component';
import { StandartInputSelectComponent } from '../../Components/UI/Selecteds/standart-input-select/standart-input-select.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomSelectedComponent,
    StandartInputSelectComponent
  ],
  exports: [
    CustomSelectedComponent
  ]
})
export class selectedModule { }
