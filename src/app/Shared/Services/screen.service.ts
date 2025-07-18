import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, debounceTime, fromEvent, startWith} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScreenService implements  OnDestroy {

  private isDesktopSubject = new BehaviorSubject<boolean>(window.innerWidth >= 1024)
  isDesktop$ = this.isDesktopSubject.asObservable()
  private resizeSub = fromEvent(window, 'resize')
    .pipe(
      debounceTime(200),
      startWith(null)
    )
    .subscribe(() => {
      const isDesktop = window.innerWidth >= 1024
      this.isDesktopSubject.next(isDesktop)
    })
  constructor() { }

  ngOnDestroy() {
    this.resizeSub.unsubscribe()
  }
}
