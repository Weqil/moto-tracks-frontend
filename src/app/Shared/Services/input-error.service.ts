import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { error } from '@ant-design/icons-angular';

@Injectable({
  providedIn: 'root'
})
export class InputErrorService {

  constructor() { }

  private validatorError:any = {
    required:'Обязательное поле',
    minlength: (error: { requiredLength: number }) => `Минимум ${error.requiredLength} символа`,
    maxlength: (error: { requiredLength:number }) => `Максимум ${error.requiredLength} символов`,
    email: 'Некорректный email',
    pattern: 'Неверный формат',
  }
  private checkControl(control:AbstractControl):string{
    if(!control || !control.errors) return ''
    if(control.errors && control.touched || control.dirty){
      let errorsInInput: ValidationErrors = control.errors
      for(let error in errorsInInput){
        const errorValue = control.errors[error];
        const message = this.validatorError[error];
        return typeof message === 'function' ? message(errorValue) : message;
      }
    }
    return ''
  }

  public checkInputInControl(control:AbstractControl): { invalid:boolean, message:string}
  {
    return {
      invalid: this.checkControl(control) ? true : false,
      message: this.checkControl(control)
    }
  }
}
