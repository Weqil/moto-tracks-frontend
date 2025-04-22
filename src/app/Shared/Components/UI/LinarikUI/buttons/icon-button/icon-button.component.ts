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
   * Тема кнопки: `dark` — тёмная по умолчанию, `red` — красная,`white` - белая
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
   *Цвет иконки кнопки
   */
@Input() buttonIconColor:'dark-icon'|'red-icon'|'white-icon' = 'dark-icon'


    /**
   *Будут ли скошены углы у кнопки
   */
  @Input() clippy:'clippy-right'|'clippy-left'|'' = ''

    /**
   *Размер 
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
   *Границы кнопки
   */
  @Input() buttonBorderWidth:'b0'|'b1'|'b2'|'b3' = 'b0'

        /**
   *Цвет границы кнопки
   */
   @Input() buttonBorderColor:'null-border'|'dark-border'|'red-border'|'white-border' = 'null-border'

        /**
   *Размер изображения
   */
   @Input() sizeIcon:'standart-size'|'little-size'= 'standart-size'



   /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */
  get getClasses():string[]{
    return [this.theme, this.buttonIconColor, this.sizeIcon, this.buttonBorderWidth, this.buttonBorderColor, this.height, this.disabled ? 'disabled':'','icon-button',this.clippy, this.elementsPosition, this.widht, 'font']
  }

  ngOnInit() {}

}
