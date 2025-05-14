import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective  } from '@maskito/angular'
import { MaskitoMask, MaskitoOptions } from '@maskito/core';


@Component({
  selector: 'app-standart-rich-input',
  templateUrl: './standart-rich-input.component.html',
  styleUrls: ['./standart-rich-input.component.scss'],
  imports: [MaskitoDirective,NgClass,ReactiveFormsModule,CommonModule]
})
export class StandartRichInputComponent  implements OnInit {

  constructor() { }
  


  /**
     * FormControl или AbstractControl, используемый для управления элементом формы
     */
  @Input() control?: any;

  /**
    * Тип ввода (например, text, password, email и т.д.)
    */
  @Input() type: string = '';

  /**
    * Метка (label), отображаемая рядом с элементом ввода
    */
  @Input() label: string = '';

  /**
    * Текст-подсказка внутри элемента ввода
    */
  @Input() placeholder: string = '';

  /**
    * Флаг, указывающий, что элемент только для чтения
    */
  @Input() readonly: boolean = false;

  /**
    * Тип маски для ввода (например, phone, date и т.д.)
    */
  @Input() maskType!: string;

  /**
    * Минимально допустимая длина ввода
    */
  @Input() minLength: number = 0;

  /**
    * Максимально допустимая длина ввода
    */
  @Input() maxLength!: number;

  /**
    * Флаг, указывающий, показывать ли пароль в текстовом виде
    */
  @Input() openPassword: boolean = false;
   
  /**
    * Тёмная тема 
  */

  @Input() dark:boolean = false

    /**
    * Тёмная тема 
  */

    @Input() gradient:boolean = false

  /**
    * Подсветит красным весь инпут
    */
  @Input() invalid: boolean = false;

  /**
    * Флаг, указывающий, что элемент заблокирован (недоступен для взаимодействия)
    */
 @Input() disabled: boolean = false;

  /**
  * Укажите путь для иконки слева
  */
 @Input() iconLeft: string = '';
  mask: MaskitoMask = new RegExp('')
  optionMask: MaskitoOptions = {
    mask: this.mask,
  }
    /**
    * Текст который будет указан в случае ошикби
    */
  @Input() errorMessage: string = ''
  @Output() changeInput: EventEmitter<string> = new EventEmitter()
  emitInput(event: any): void {
    this.changeInput.emit(event)
  }

  renderMask() {
    if (this.maskType == 'phone') {
      this.optionMask = {
        mask: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      }
    } else {
    }
  }

  TrimValue():void {
    const trimmedValue = this.control.value?.trim();
    this.control.setValue(trimmedValue, {emitEvent: false});
  }

  ngOnChanges() {}
  openPasword(input: any) {
    input.type = input.type === 'password' ? 'text' : 'password'
  }
  get allClasses():string[]{
    return [
      'standart-input',
      this.invalid ? 'inavlid__input':'',
      this.dark ? 'dark':'',
      this.gradient ? 'gradient':'',
      this.disabled ? 'standart-input_disabled' : '',
      'cursor',
    ]
  }
  get getClassesInWrapper():string[]{
    return [
        this.iconLeft ? 'icon-left':'',
        this.invalid ? 'invalid-filter':'',
    ]
  }
  ngOnInit() {
    this.renderMask()
  }

  openDatePicker(input: HTMLInputElement) {
    
    if (input.showPicker) {
      input.showPicker();
    } else {
      input.focus();
    }
  }

}
function maskitoPhoneOptionsGenerator(arg0: {
  countryIsoCode: string
  metadata: any
}): import('@maskito/core').MaskitoMask {
  throw new Error('Function not implemented.')
}



