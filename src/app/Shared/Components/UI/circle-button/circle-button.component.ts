import { Component, Input, OnInit } from '@angular/core';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

@Component({
  selector: 'app-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.scss'],
})
export class CircleButtonComponent  implements OnInit {

  @Input() icon!:string
  @Input() disabled!:boolean
  constructor() { }

  ngOnInit() {}

}
