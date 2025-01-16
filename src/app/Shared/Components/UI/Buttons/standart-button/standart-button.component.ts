import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-standart-button',
  templateUrl: './standart-button.component.html',
  styleUrls: ['./standart-button.component.scss'],
  imports: [NgClass]
})
export class StandartButtonComponent  implements OnInit {

  constructor() { }
  @Input() buttonText: String = ''
  @Input() disabled:boolean = false
  @Input() type: string = ''
  @Input() theme: string = ''

  checkTypeButton():string {
    if(!this.disabled){
      if(this.theme == '' || this.theme == 'standart'){
        return 'standart-button'
      }
    }

    return 'standart-button_disabled'
  }
  ngOnInit() {}

}
