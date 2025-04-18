import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports:[NgClass,CommonModule]
})
export class IconButtonComponent  implements OnInit {

  constructor() { }
   /**
   * Тема кнопки: `dark` — тёмная по умолчанию, `red` — красная
   */
  @Input() theme: 'dark'|'red'|'white' = 'dark'

  /**
   * Кнопка будет выглядеть недоступной
   */
  @Input() disabled:boolean = false

   /**
   * Тип кнопки
   */

  @Input() type:'button'|'submit'|'reset' = 'button'

   /**
   * Высота кнопки: стандартная или удлинённая
   */
  @Input() height: 'standart-height'|'long-height'|'little-height' = 'standart-height'

   /**
   * Путь картинки которая будет слева от текста
   */
  @Input() icon:string = ''

    /**
   *Будут ли скошены углы у кнопки
   */
  @Input() clippy:'clippy-right'|'clippy-left'|'' = ''

    /**
   *Размер кнопки
   */
  @Input() widht:'w40'|'w49'|'w52'|'w58'|'w71' = 'w40'

   /**
   *Как будут расположены элементы внутри кнопки
   */
  @Input() elementsPosition:'elements-position'|'elements-position__row' = 'elements-position'

    /**
   *Текст кнопки
   */
  @Input() buttonText:string =''

   /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */
  get getClasses():string[]{
    return [this.theme, this.height, this.disabled ? 'disabled':'','icon-button',this.clippy, this.elementsPosition, this.widht, 'font']
  }

  ngOnInit() {}

}
