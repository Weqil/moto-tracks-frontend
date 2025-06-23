import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { getApp } from 'firebase/app';
import { FirebaseInitService } from './firebase-init.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging: any = null;
  constructor(
    private firebaseInitService: FirebaseInitService
  ) {
    const firebaseApp = firebaseInitService.initFirebase(environment.firebase);

    // Проверяем поддержку FCM
    isSupported().then(supported => {
      if (supported) {
        try {
          this.messaging = getMessaging(firebaseApp);
          this.listenToMessages(); // Подписка на сообщения
        } catch (e) {
          console.error('Firebase Messaging не может быть инициализирован', e);
        }
      } else {
        console.warn('FCM не поддерживается в этом браузере');
      }
    });
  }
    requestPermission() {
    if (!this.messaging) return;

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        getToken(this.messaging, {
          vapidKey: environment.firebase.vapidKey
        }).then(token => {
          if (token) {
            console.log('FCM Token:', token);
          } else {
            console.warn('Не удалось получить токен');
          }
        }).catch(err => {
          console.error('Ошибка получения токена', err);
        });
      } else {
        console.warn('Разрешение на уведомления отклонено');
      }
    });
  }

  /**
   * Слушаем входящие сообщения (Foreground)
   */
  private listenToMessages() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Сообщение получено в foreground:', payload);

      if (payload.notification) {
        const { title, body, icon } = payload.notification;

        // Показываем нативное уведомление
        new Notification(String(title), {
          body,
          icon: icon || 'assets/icons/plus.svg'
        });
      }
    });
  }

}
