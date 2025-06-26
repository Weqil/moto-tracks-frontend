import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InAppNotificationService } from '@app/Shared/Data/Services/in-app-notification.service';

export interface InAppNotification {
  title: string;
  message: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [NgIf, CommonModule]
})
export class NotificationComponent  implements OnInit {
  hidden = false;
  
  notification$ = this.notificationService.notification$;
  constructor(private notificationService: InAppNotificationService) {}


  ngOnInit() {
  this.notification$.subscribe(notification => {
    if (notification) {
      this.hidden = false;
      // ставим флаг "скрыть" ближе к таймауту
      setTimeout(() => {
        this.hidden = true;
      }, 350);
    }
  });
}

}
