import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { IonicSlides } from '@ionic/angular'
import { register } from 'swiper/element/bundle';
import { environment } from 'src/environments/environment'
import { DomSanitizer } from '@angular/platform-browser'
import { CommonModule } from '@angular/common';
import { Swiper } from 'swiper/types';
import { CheckImgUrlPipe } from "../../../../Helpers/check-img-url.pipe";

register()
@Component({
  selector: 'app-show-slider',
  templateUrl: './show-slider.component.html',
  styleUrls: ['./show-slider.component.scss'],
  standalone: true,
  imports: [CommonModule, CheckImgUrlPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShowSliderComponent implements OnInit {
  constructor() {}

  @Input() files?: any[]
  @Input() categoryType: any
  swiperModules = [IonicSlides]
  sanitizer: DomSanitizer = inject(DomSanitizer)

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined
  swiperIndex: number = 1

  iframeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  slideChange(event: any) {
    this.swiperIndex = event.detail[0].activeIndex + 1
  }

  ngOnInit() {}
}
