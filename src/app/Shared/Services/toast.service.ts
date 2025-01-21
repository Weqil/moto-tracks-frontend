import { Injectable } from '@angular/core'
import { ToastController } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  /**
   *
   * @param message any string
   * @param type ["primary", "secondary", "tertiary", "success", "warning", "danger", "light", "medium", and "dark"]
   */
  async showToast(message: string, type: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      color: type,
      position: 'top',
      buttons: [
        {
          text: 'Х',
          role: 'cancel',
        },
      ],
    })

    await toast.present()
  }
}

//stack toasts
// toastCtrl(color,msg,duration?) {
//   const toast = {
//     message: msg,
//     color: color,
//     duration: duration || 3000
//   };
//   this.toasts.push(toast)
//   const timeout = (this.toasts.length - 1) * toast.duration
//   this.show(timeout);
// }
// show(timeout) {
//   setTimeout(async () => {
//     const toast = await this.toastController.create(this.toasts[0]);
//     await toast.present();
//     this.toasts.splice(0, 1);
//   }, timeout > 0 ? timeout + 800 : 0);

// }
