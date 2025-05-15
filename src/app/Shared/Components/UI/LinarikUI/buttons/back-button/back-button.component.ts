import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  imports:[NgClass]
})
export class BackButtonComponent  implements OnInit {

  constructor() { }

  /**
  * Тема кнопки: `dark` — тёмная по умолчанию, `red` — красная, `white` — белая, `gray` - серая
  */
  @Input() theme: 'dark'|'gray'|'red'|'white' = 'gray'

  /**
  * Цвет текста
  */
  @Input() fontColor: 'font-dark'|'font-red'|'font-white' = 'font-white'

   /**
  * Обводка кнопки 
  */
  @Input() border:'red-border'|'gray-border'|'' = ''

    /**
   *Ширина кнопки
   */
   @Input() widht:'w80' | 'full' = 'w80'

  /**
  * Кнопка будет выглядеть недоступной
  */
  @Input() disabled:boolean = false

  /**
  * Текст кнопки
  */
  @Input() buttonText:string ='Назад'

  /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */

    get getClasses():string[]{
      return [this.theme, this.disabled ? 'disabled':'',this.widht, this.border, this.fontColor,'back-button','font']
    }

  ngOnInit() {}

}
