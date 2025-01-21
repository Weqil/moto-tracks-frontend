import { Component, Input, OnInit } from '@angular/core';
import { CheckImgUrlPipe } from "../../../../Helpers/check-img-url.pipe";

@Component({
  selector: 'app-horizontal-swiper',
  templateUrl: './horizontal-swiper.component.html',
  styleUrls: ['./horizontal-swiper.component.scss'],
  imports: [CheckImgUrlPipe],
})
export class HorizontalSwiperComponent  implements OnInit {

  constructor() { }
  @Input() files:any


  ngOnInit() {}

}
