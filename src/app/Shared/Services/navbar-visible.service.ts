import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarVisibleService {

  constructor() { }
  visible:BehaviorSubject<boolean> = new BehaviorSubject(true)

  hideNavBar(){
    this.visible.next(false) 
  }
  showNavBar(){
    this.visible.next(true)
  }
}
