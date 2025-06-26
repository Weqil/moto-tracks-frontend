import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { getApp } from 'firebase/app';
import { FirebaseInitService } from './firebase-init.service';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { catchError, EMPTY, of } from 'rxjs';
import { FCM } from '@capacitor-community/fcm';
import { InAppNotification, InAppNotificationService } from '../Data/Services/in-app-notification.service';


@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging: any = null;
  toastService: ToastService = inject(ToastService);
  http: HttpClient = inject(HttpClient)
  authService: AuthService = inject(AuthService) 
  inAppNotificationService: InAppNotificationService = inject(InAppNotificationService)
  constructor(
    private firebaseInitService: FirebaseInitService
  ) {
    switch(Capacitor.getPlatform()) {
        case('ios'):
          break
        case('android'):
          break
        case('web'):
          const firebaseApp = firebaseInitService.initFirebase(environment.firebase);

          // Проверяем поддержку FCM
          isSupported().then((supported:any) => {
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
          break
      }
  }
    requestPermission() {
      switch(Capacitor.getPlatform()) {
        case('ios'):
          this.initForMobile()
          break
        case('android'):
          this.initForMobile()
          break
        case('web'):
          this.initForWeb()
          break
      }
  }

  initForWeb() {
    if (!this.messaging) return;
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        getToken(this.messaging, {
            vapidKey: environment.firebase.vapidKey
          }).then((token:string) => {
            if (token) {
              console.log('FCM Token:', token);
              this.pushTokenToServer(token).pipe(
                catchError((err: any) => {
                  return of(EMPTY) // Ошибка создания токена на сервере, скорее всего токен уже существет, ничего не надо делать.
                })).subscribe((response: any) => {
                  // console.log(response) // Токен отправлен и сохранён на сервере
                })
            } else {
              this.toastService.showToast('Не удалось получить токен для уведомлений', 'warning')
            }
          }).catch(() => {
            this.toastService.showToast('Ошибка получения токена уведомлений', 'error')
          });
      } else {
        // this.toastService.showToast('Разрешение на уведомления отклонено', 'primary')
      }
    })
  }

  async initForMobile() {
    PushNotifications.requestPermissions().then((result: any) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        this.toastService.showToast('Разрешение на уведомления отклонено', 'primary')
      }
    });

    // Get FCM token instead of the APN one returned by Capacitor (получение токена)
    this.getToken()

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('FCM Token register error:', error);
        this.toastService.showToast(error, 'error')
        // alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.toastService.showToast(JSON.stringify(notification), 'light')

        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        this.toastService.showToast(JSON.stringify(notification), 'primary')
        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  getToken() {
    switch(Capacitor.getPlatform()) {
        case('ios'):
          FCM.getToken()
            .then(r => {
              this.toastService.showToast(String(r.token), 'primary')
              console.log('FCM Token:', r.token);
              this.pushTokenToServer(r.token).pipe(
                catchError((err: any) => {
                  console.log(err.message)
                  return of(EMPTY) // Ошибка создания токена на сервере, скорее всего токен уже существет, ничего не надо делать.
                })).subscribe((response: any) => {
                  // console.log(response) // Токен отправлен и сохранён на сервере
                })
              })
            .catch(err => console.log(err));
          break
        case('android'):
          PushNotifications.addListener('registration', (token: Token) => {
            this.toastService.showToast(String(token), 'primary')
            console.log('FCM Token:', token.value);
            this.pushTokenToServer(token.value).pipe(
              catchError((err: any) => {
                console.log(err.message)
                return of(EMPTY) // Ошибка создания токена на сервере, скорее всего токен уже существет, ничего не надо делать.
              })).subscribe((response: any) => {
                // console.log(response) // Токен отправлен и сохранён на сервере
              })
          }
      );
          break
      }
  }
  /**
   * Слушаем входящие сообщения (Foreground)
   */
  private listenToMessages() {
    if (!this.messaging) return;
    onMessage(this.messaging, (payload) => {
      let data: InAppNotification = {
        title: String(payload.notification?.title),
        message: String(payload.notification?.body)
      }
      this.inAppNotificationService.show(data);
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

  pushTokenToServer(token: string) {
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/fcm-tokens`, 
      {
        token: token,
        platform: Capacitor.getPlatform(),
        userId: this.authService.getCurrentUserId()
    })
  } 

}
