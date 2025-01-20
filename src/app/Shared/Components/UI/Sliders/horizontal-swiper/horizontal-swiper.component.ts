import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-horizontal-swiper',
  templateUrl: './horizontal-swiper.component.html',
  styleUrls: ['./horizontal-swiper.component.scss'],
})
export class HorizontalSwiperComponent  implements OnInit {

  constructor() { }
  @Input() files:any


  ngOnInit() {}

}
