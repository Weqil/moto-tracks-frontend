import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../Components/UI/header/header.component';
import { HeaderStrongComponent } from '../../Components/UI/header-strong/header-strong.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    HeaderStrongComponent
  ],
  exports: [
    HeaderComponent,
    HeaderStrongComponent
  ]
})
export class HeaderModule { }
