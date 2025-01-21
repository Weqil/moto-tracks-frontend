import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepContainerComponent } from '../../Components/UI/Wrappers/step-container/step-container.component';
import { StepContainerItemComponent } from '../../Components/UI/Wrappers/step-container-item/step-container-item.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StepContainerItemComponent,
    StepContainerComponent
  ],
  exports: [
    StepContainerComponent,
    StepContainerItemComponent
  ]
})
export class StepsModule { }
