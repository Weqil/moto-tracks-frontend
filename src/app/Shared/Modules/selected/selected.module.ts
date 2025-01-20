import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectedComponent } from '../../Components/UI/Selecteds/custom-selected/custom-selected.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomSelectedComponent
  ],
  exports: [
    CustomSelectedComponent
  ]
})
export class selectedModule { }
