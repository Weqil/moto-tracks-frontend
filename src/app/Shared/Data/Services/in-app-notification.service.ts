import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface InAppNotification {
  title: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class InAppNotificationService {
  private notificationSubject = new BehaviorSubject<InAppNotification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  show(notification: InAppNotification, duration = 4000) {
    this.notificationSubject.next(notification);
    setTimeout(() => this.hide(), duration);
  }

  hide() {
    console.log('hide')
    this.notificationSubject.next(null);
  }
}
