import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular/standalone'
import { MessagesLoading } from '../Enums/messages-loading'

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = MessagesLoading.default) {
    const loader = await this.loadingController.create({
      message: message,
      spinner: 'circular',
    })

    await loader.present()
  }

  async hideLoading() {
    this.checkAndCloseLoader()
    // console.log(this.loadingController.getTop())
    // setTimeout(() => this.checkAndCloseLoader(), 500);
  }

  async checkAndCloseLoader() {
    const loader = await this.loadingController.getTop()
    if (loader !== undefined) {
      await this.loadingController.dismiss()
    } else {
      setTimeout(() => this.checkAndCloseLoader(), 1000)
    }
  }
}
