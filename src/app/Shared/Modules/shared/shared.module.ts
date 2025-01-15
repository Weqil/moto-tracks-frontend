import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
  
  ],
  imports: [
    IonContent,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

})
export class SharedModule { }
