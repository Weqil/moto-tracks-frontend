import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.scss'],
})
export class InfoPopoverComponent  implements OnInit {

  constructor() { }
  @Input() text: string = ''
  ngOnInit() {}

}
