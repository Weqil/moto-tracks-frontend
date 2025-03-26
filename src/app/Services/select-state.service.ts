import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectStateService {
  private activeSelectName = new BehaviorSubject<string | null>(null);

  activeSelectName$ = this.activeSelectName.asObservable();

  setActiveSelect(name: string) {
    this.activeSelectName.next(name);
  }

  closeAllSelects() {
    this.activeSelectName.next(null);
  }

  isSelectActive(name: string): boolean {
    return this.activeSelectName.value === name;
  }
} 