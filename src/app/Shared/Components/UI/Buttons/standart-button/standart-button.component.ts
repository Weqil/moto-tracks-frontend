import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-standart-button',
  templateUrl: './standart-button.component.html',
  styleUrls: ['./standart-button.component.scss'],
})
export class StandartButtonComponent  implements OnInit {

  constructor() { }
  @Input() buttonText: String = ''

  ngOnInit() {}

}
