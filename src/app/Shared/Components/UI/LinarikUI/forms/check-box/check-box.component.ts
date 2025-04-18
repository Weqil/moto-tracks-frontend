import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface ValueCheckBox {
  state: boolean;
  value: any;
}
@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  imports:[NgClass]
})

export class CheckBoxComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  
   /**
  * Высота всего блока чекбокса: стандартная или удлинённая
  */
  @Input() height: 'standart-height'|'long-height' = 'standart-height'

  /**
  *Будут ли скошены углы у кнопки
  */
  @Input() clippy:'clippy-right'|'clippy-left'|'' = ''
  
  /**
  *Значение вашего чекбокса
  */
  @Input() value:any

  @Output() change:EventEmitter<ValueCheckBox> = new EventEmitter()

  /**
  *Состояние чекбокса
  */
  @Input() checked:boolean = false

  @Input() labelText:string = ''

   /**
   * Тема кнопки: `gray` — тёмная по умолчанию, `red` — красная,`white` - белая
   */
   @Input() theme: 'gray'|'red'|'white' = 'gray'

  
   /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */

   onChange(){
      this.change.emit(
        {
          state:this.checked,
          value:this.value,
        }
      )
   }
  
   get getClasses():string[]{
    return [this.height,this.clippy,this.theme]
  }

}
