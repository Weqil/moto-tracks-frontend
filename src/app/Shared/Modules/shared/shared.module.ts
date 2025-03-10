import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent,IonSkeletonText, } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '../buttons/buttons.module';


@NgModule({
  declarations: [
  
  ],
  imports: [
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    IonSkeletonText  
  ],
  exports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSkeletonText,
    ButtonsModule
  ],

})
export class SharedModule { }
