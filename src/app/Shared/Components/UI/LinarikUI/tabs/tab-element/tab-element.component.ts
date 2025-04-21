import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface ValueTab {
  state: boolean;
  value: any;
}
@Component({
  selector: 'app-tab-element',
  templateUrl: './tab-element.component.html',
  styleUrls: ['./tab-element.component.scss'],
  imports:[
    NgClass
  ]
})
export class TabElementComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
   /**
   * Состояние вкладки
   */
  @Input() active:boolean = true

   /**
   * Текст вкладки
   */
   @Input() text:string = ''

   @Output() change:EventEmitter<ValueTab> = new EventEmitter()

   onChange(){
    this.change.emit({
      state:this.active,
      value:this.text
    })
   }
   
}
