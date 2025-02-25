import { CommonModule } from '@angular/common';
import { Swiper } from 'swiper/types';
import { IonModal, IonContent } from '@ionic/angular/standalone';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { IonicSlides } from '@ionic/angular'
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';

register()
@Component({
  selector: 'app-images-modal',
  templateUrl: './images-modal.component.html',
  styleUrls: ['./images-modal.component.scss'],
  imports: [IonModal, IonContent, ButtonsModule, SlidersModule, SharedModule, CheckImgUrlPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagesModalComponent  implements OnInit {
 constructor() {}

  @Input() imagesPathArray: any = []
  @Output() closeModalEmit: EventEmitter<any> = new EventEmitter()
  @Input() openModal!: boolean
  sanitizer: DomSanitizer = inject(DomSanitizer)
  checkImgUrlPipe: CheckImgUrlPipe = inject(CheckImgUrlPipe)
  swiperIndex: number = 1

 
  closeModal() {
    this.closeModalEmit.emit()
  }
  checkUrl(file: any) {
    return this.checkImgUrlPipe.checkUrlDontType(file)
  }


  iframeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }


  slideChange(event: any) {
    this.swiperIndex = event.detail[0].activeIndex + 1
  }

  
  ngOnInit() {}

}
