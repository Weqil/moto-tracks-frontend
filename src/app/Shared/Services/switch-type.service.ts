import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SwitchTypeService {
  public currentType: BehaviorSubject<string> = new BehaviorSubject<string>(this.getTypeFromLocalSorage() || 'events')
  public link: BehaviorSubject<string> = new BehaviorSubject<string>('/' + this.getTypeFromLocalSorage() || '/events')
  constructor() {}

  changeType() {
    if (this.currentType.value == 'events') {
      this.setTypeInLocalSorage('sights')
      this.link.next('/sights')
    } else {
      this.setTypeInLocalSorage('events')
      this.link.next('/events')
    }
  }

  setTypeInLocalSorage(value: string) {
    this.currentType.next(value)
    this.link.next('/' + value)
    localStorage.setItem('type', value)
  }
  getTypeFromLocalSorage() {
    return localStorage.getItem('type') || 'events'
  }
}
