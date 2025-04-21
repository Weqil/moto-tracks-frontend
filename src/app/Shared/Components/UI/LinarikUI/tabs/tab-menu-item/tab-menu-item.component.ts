import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-menu-item',
  templateUrl: './tab-menu-item.component.html',
  styleUrls: ['./tab-menu-item.component.scss'],
  imports:[CommonModule]
})
export class TabMenuItemComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

   /**
  * Текст внутри элемента
  */
  @Input() name!: string
    /**
  * Иконка слева от текста
  */
  @Input() icon!: string
    /**
  * Цвет иконки
  */
  @Input() iconColor!: string
     /**
  * Фильтер на икноке 
  */
  @Input() iconFilter!: string
  @Input() routing!: string

}
