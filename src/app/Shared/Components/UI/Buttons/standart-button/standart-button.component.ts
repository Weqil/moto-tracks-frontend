import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  handleClick(): void {
    if(!this.disabled) this.onClick.emit()
  }
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
