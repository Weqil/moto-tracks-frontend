import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usersPluralRule',
  standalone: true
})
export class UsersPluralRulePipe implements PipeTransform {
  pluralRules = new Intl.PluralRules('ru');
  forms:any = {
    one:'участник',
    few: 'участника',
    many: 'участников',
    other: 'участников'
  }
   transformUsers(count:number):string{
    return `${count} ${this.forms[this.pluralRules.select(count)]}`
  }
  transform(count:number|any): string {
    if(count){
      return this.transformUsers(count);
    }
    return ''
  } 

}
