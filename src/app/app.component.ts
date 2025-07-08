import { App } from '@capacitor/app'
import { Router } from '@angular/router'
import { Component, inject } from '@angular/core'
import {
  IonApp,
  IonRouterOutlet,
  NavController,
  IonModal,
  IonContent,
  IonToolbar,
  IonTitle,
  IonFooter,
  IonButton,
  IonHeader,
} from '@ionic/angular/standalone'
import { UserService } from './Shared/Data/Services/User/user.service'
import { Moment } from 'moment'
import { CupService } from './Shared/Data/Services/cup.service'
import { Capacitor } from '@capacitor/core'
import { VersionService } from './Shared/Data/Services/version.service'
import { IconButtonComponent } from './Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { SportTypesService } from './Shared/Data/Services/sport-types.service'
import localeRu from '@angular/common/locales/ru'
import { CommonModule, NgIf, registerLocaleData } from '@angular/common'
import { FcmService } from './Shared/Services/fcm.service'
import { ToastService } from './Shared/Services/toast.service'
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications'
import { InAppNotification, NotificationComponent } from './Shared/Components/Notification/notification.component'
import { i } from '@angular/cdk/data-source.d-Bblv7Zvh'
import { InAppNotificationService } from './Shared/Data/Services/in-app-notification.service'

async function getAppVersion() {
  console.log('add favicon')
  const platform = Capacitor.getPlatform()
  if (Capacitor.isNativePlatform() || platform == 'ios' || platform == 'android') {
    const info = await App.getInfo()
    return info.version
  }
  return false
}

registerLocaleData(localeRu, 'ru')
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    NotificationComponent,
    IonHeader,
    IonFooter,
    IonTitle,
    IonToolbar,
    IonContent,
    IonModal,
    IonApp,
    IonRouterOutlet,
    IconButtonComponent,
    CommonModule,
  ],
})
export class AppComponent {
  private startTimeInBackground?: Moment
  private finishTimeInBackground?: Moment

  navController: NavController = inject(NavController)
  versionService: VersionService = inject(VersionService)
  fcmService: FcmService = inject(FcmService)
  toastService: ToastService = inject(ToastService)
  userService: UserService = inject(UserService)
  cupService: CupService = inject(CupService)

  sportCategoryModalState: boolean = false
  contentTypes: any = []
  sportCategoryColorObject: any = {
    Мотокросс: 'red',
    Эндуро: 'green',
  }
  sportTypesService: SportTypesService = inject(SportTypesService)
  userHaveCurrentVersion: boolean = true
  PushNotifications: any
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private inAppNotificationService: InAppNotificationService,
  ) {}
  onUpdate() {
    const platform = Capacitor.getPlatform()

    if (platform === 'ios') {
      window.open('https://apps.apple.com/us/app/%D0%BC%D0%BE%D1%82%D0%BE%D0%BA%D1%80%D0%BE%D1%81c/id6741205282', '_system') // ссылка на App Store
    } else if (platform === 'android') {
      window.open('https://www.rustore.ru/catalog/app/com.policam.motokros', '_system') // ссылка на Google Play
    } else {
      location.reload() // для PWA/web
    }
  }

  getSportTypeColor(sportTypeName: string) {
    return this.sportCategoryColorObject[sportTypeName] || 'dark'
  }

  cleanNumberInPoint(number: string) {
    return Number(number.split('.').join(''))
  }

  setContentTypeInLocalStorage(contentType: { id: number; name: string }) {
    this.sportTypesService.setContentType(contentType)
    window.location.reload()
  }

  getAllSportCategory() {
    if (!this.sportTypesService.getContentTypeInLocalStorage()) {
      this.sportTypesService
        .getAllSportCategory()
        .pipe()
        .subscribe((res: any) => {
          this.sportTypesService.selectSportCategory.next(true)
          this.contentTypes = res.content_types
        })
    } else {
      this.sportTypesService
        .getAllSportCategory()
        .pipe()
        .subscribe((res: any) => {
          this.contentTypes = res.content_types
        })
    }
  }

  getLastVersion() {
    let version: any = false
    getAppVersion().then((res) => {
      version = res
      const platform = Capacitor.getPlatform()
      if (!!version) {
        this.versionService
          .getLastVersion()
          .pipe()
          .subscribe((res: any) => {
            if (res.version && res.version.version_number) {
              this.userHaveCurrentVersion = this.cleanNumberInPoint(version) >= this.cleanNumberInPoint(res.version.version_number)
            }
          })
      } else {
      }
    })
  }

  askForNotifications() {
    this.fcmService.requestPermission()
  }
  ngOnInit() {
    // console.log(this.stringHaveCurrentWords('50 см3','Коляски 7 50 см3'))
    this.getLastVersion()
    this.sportTypesService.selectSportCategory.subscribe((res) => {
      this.sportCategoryModalState = res
    })
    this.getAllSportCategory()

    this.userService
      .getChangeRoles()
      .pipe()
      .subscribe((res: any) => {
        this.userService.allRoles = res.role
      })
    this.userService.refreshUser()
    this.cupService.getAllDegree().subscribe((res: any) => {
      this.cupService.allDegree.next(res.degree)
    })
    this.userService.user.pipe().subscribe(() => {
      this.fcmService.requestPermission()
    })
    // инициализация  push для web
    this.fcmService.requestPermission()
    document.addEventListener('click', this.onFirstUserInteraction, { once: true })
  }

  onFirstUserInteraction = () => {
    if (Capacitor.getPlatform() === 'web') this.fcmService.requestPermission()
  }
}
