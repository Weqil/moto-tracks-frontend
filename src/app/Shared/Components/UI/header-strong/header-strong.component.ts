import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-strong',
  templateUrl: './header-strong.component.html',
  styleUrls: ['./header-strong.component.scss'],
})
export class HeaderStrongComponent  implements OnInit {

  constructor() { }
  @Input() image!: string

  ngOnInit() {}

}
