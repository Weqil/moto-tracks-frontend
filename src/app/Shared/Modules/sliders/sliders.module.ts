import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalSwiperComponent } from '../../Components/UI/Sliders/horizontal-swiper/horizontal-swiper.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HorizontalSwiperComponent
  ],
  exports: [HorizontalSwiperComponent]
})
export class SlidersModule { }
