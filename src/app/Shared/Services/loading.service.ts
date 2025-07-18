import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular/standalone'
import { MessagesLoading } from '../Enums/messages-loading'
import { finalize, forkJoin, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private loadingController: LoadingController) {}

  async showLoading(message: string = MessagesLoading.default) {
    const loader: HTMLIonLoadingElement = await this.loadingController.create({
      message: message,
      spinner: 'circular',
    })
    await loader.present()
    return loader
  }

  async hideLoading(loader?: HTMLIonLoadingElement) {
    if (!loader) {
      this.checkAndCloseLoader()
    } else {
      await loader.dismiss()
    }

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

  observableLoaderScoup(functionArrays: Observable<any>[]) {
    let loader!: HTMLIonLoadingElement
    this.showLoading().then((res) => (loader = res))
    return forkJoin(functionArrays).pipe(
      finalize(() => {
        this.hideLoading(loader)
      }),
    )
  }
}
