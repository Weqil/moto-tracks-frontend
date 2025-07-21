import { CommonModule, NgClass } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  imports:[NgClass,CommonModule]
})
export class  IconButtonComponent  implements OnInit {

  constructor() { }
   /**
   * Тема кнопки: `dark` — тёмная по умолчанию, `red` — красная,`white` - белая,`gray`
   */
  @Input() theme: 'dark'|'red'|'white'|'dark-gray'|'green--light'|'red--light'| 'green' | 'transparent' = 'dark'

    /**
   * Расположить элементы сначала
   */
  @Input() elementsInStart:boolean = false

   /**
   * Полоски в начале и в конце
   */
  @Input() shapeColumn:boolean = false
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
  @Input() height: 'auto-height'|'standart-height'|'long-height'|'little-height'|'height64' = 'standart-height'

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
  @Input() clippy:'clippy-right'|'clippy-left'|''|'nav-clipy' = ''

    /**
   *Размер
   */
  @Input() widht:'w20'|'w40'|'w49'|'w52'|'w58'|'w71'|'full' = 'w40'

   /**
   *Как будут расположены элементы внутри кнопки
   */
  @Input() elementsPosition:'elements-position'|'elements-position__row_reverse'|'elements-position__row'|'row__reverse'  = 'elements-position'

    /**
   *Текст кнопки
   */
  @Input() buttonText:string|number =''

      /**
   *Границы кнопки
   */
  @Input() buttonBorderWidth:'b0'|'b1'|'b2'|'b3'|'b05' = 'b0'

        /**
   *Цвет границы кнопки
   */
   @Input() buttonBorderColor:'null-border'|'dark-border'|'red-border'|'white-border' = 'null-border'

           /**
   *Цвет текста кнопки
   */
  //  @Input() buttonTextColor:'black-text'|'white-text'|'red-text' = 'black-text'

        /**
   *Размер изображения
   */
   @Input() sizeIcon:'standart-size'|'little-size'= 'standart-size'

         /**
   *Жирность текста
   */
   @Input() font:'font'|'font-bold'|'font__semi-bold'|'font__new-second-font-regular'|'font__new-second-font-medium'|'none' = 'font'

  /**
   *Размер текста
   */
   @Input() fontSize:'litle-font-size'|'standart-font-size'|'big-font-size' = 'standart-font-size'

   @Input() fontColor:'standart-color'|'red-color' = 'standart-color'

            /**
   *Выход текста за границы и замещение троеточием
   */

   @Input() trimButtonText:'trim'|'no-trim' = 'no-trim'

  /**
   *Добавление отступов справа и слева для logo
   */
    @Input() iconMargin:'icon-margin-standard'|'icon-margin-none' = 'icon-margin-standard'

  /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */
  get getClasses():string[]{
    return [this.theme, this.buttonIconColor, this.fontSize, this.trimButtonText,
      this.sizeIcon, this.buttonBorderWidth, this.buttonBorderColor, this.height, this.disabled ? 'disabled':'','icon-button',this.clippy, this.elementsPosition, this.widht, this.font, this.fontColor, this.elementsInStart ? 'elements-in-start':'', this.iconMargin]
  }

  ngOnInit() {}

}
