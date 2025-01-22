import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalSwiperComponent } from '../../Components/UI/Sliders/horizontal-swiper/horizontal-swiper.component';
import { ShowSliderComponent } from '../../Components/UI/Sliders/show-slider/show-slider.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HorizontalSwiperComponent,
    ShowSliderComponent,
  ],
  exports: [HorizontalSwiperComponent,ShowSliderComponent]
})
export class SlidersModule { }
