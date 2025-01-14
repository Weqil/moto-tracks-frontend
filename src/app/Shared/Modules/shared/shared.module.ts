import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';

@NgModule({
  declarations: [
  
  ],
  imports: [
    IonContent,
  ],
  exports: [
    IonContent,
    CommonModule,
  ],

})
export class SharedModule { }
