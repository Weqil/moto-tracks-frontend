import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MaskitoMask, MaskitoOptions,  } from '@maskito/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { MaskitoDirective  } from '@maskito/angular'
@Component({
  selector: 'app-standart-input',
  templateUrl: './standart-input.component.html',
  styleUrls: ['./standart-input.component.scss'],
  imports: [SharedModule, MaskitoDirective]
})
export class StandartInputComponent implements OnInit {
  constructor() {}

  @Input() control?: any
  @Input() type: string = ''
  @Input() label: string = ''
  @Input() placeholder: string = ''
  @Input() readonly: boolean = false
  @Input() maskType!: string
  @Input() minLength: number = 0
  @Input() maxLength!: number
  @Input() openPassword: boolean = false
  @Input() invalid: boolean = false
  @Input() disabled: boolean = false
  mask: MaskitoMask = new RegExp('')
  optionMask: MaskitoOptions = {
    mask: this.mask,
  }
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

  ngOnChanges() {}
  openPasword(input: any) {
    input.type = input.type === 'password' ? 'text' : 'password'
  }
  ngOnInit() {
    this.renderMask()
  }
}
function maskitoPhoneOptionsGenerator(arg0: {
  countryIsoCode: string
  metadata: any
}): import('@maskito/core').MaskitoMask {
  throw new Error('Function not implemented.')
}

