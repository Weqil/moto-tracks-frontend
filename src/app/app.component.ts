import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController, IonModal, IonContent, IonToolbar, IonTitle, IonFooter, IonButton, IonHeader } from '@ionic/angular/standalone';
import { UserService } from './Shared/Data/Services/User/user.service';
import { Moment } from 'moment'
import { CupService } from './Shared/Data/Services/cup.service';
import { Capacitor } from '@capacitor/core';
import { VersionService } from './Shared/Data/Services/version.service';
import { IconButtonComponent } from "./Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import { SportTypesService } from './Shared/Data/Services/sport-types.service';
import { CommonModule } from '@angular/common';
import { FcmService } from './Shared/Services/fcm.service';
import { ToastService } from './Shared/Services/toast.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';



async function getAppVersion() {
  const platform = Capacitor.getPlatform();
  if (Capacitor.isNativePlatform() || platform == 'ios' || platform == 'android') {
    const info = await App.getInfo();
    return info.version;
  } 
  return false
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonHeader, IonButton, IonFooter, IonTitle, IonToolbar, IonContent, IonModal, IonApp, IonRouterOutlet, IconButtonComponent,CommonModule],
})

export class AppComponent {
  private startTimeInBackground?: Moment;
  private finishTimeInBackground?: Moment;
  navController: NavController = inject(NavController)
  versionService:VersionService = inject(VersionService)
  fcmService: FcmService = inject(FcmService)
  toastService: ToastService = inject(ToastService)
  sportCategoryModalState:boolean = false
  contentTypes:any = [];
  sportCategoryColorObject:any = {
    Мотокросс:'red',
    Эндуро:'green'
  }
  sportTypesService: SportTypesService = inject(SportTypesService)
  userHaveCurrentVersion:boolean = true
  PushNotifications: any;
  constructor(private navCtrl: NavController, private router: Router) {
  }
  initPushNotifications() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.toastService.showToast(token.value, 'success')
        console.log(token.value)
        // alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        this.toastService.showToast(error, 'error')
        // alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.toastService.showToast(JSON.stringify(notification), 'primary')

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
   onUpdate() {
    const platform = Capacitor.getPlatform();

    if (platform === 'ios') {
      window.open('https://apps.apple.com/us/app/%D0%BC%D0%BE%D1%82%D0%BE%D0%BA%D1%80%D0%BE%D1%81c/id6741205282', '_system'); // ссылка на App Store
    } else if (platform === 'android') {
      window.open('https://www.rustore.ru/catalog/app/com.policam.motokros', '_system'); // ссылка на Google Play
    } else {
      location.reload(); // для PWA/web
    }
  }

  getSportTypeColor(sportTypeName:string){
    return this.sportCategoryColorObject[sportTypeName] || 'dark'
  }

  cleanNumberInPoint(number:string){
    return Number(number.split('.').join(''))
  }


  setContentTypeInLocalStorage(contentType:{id:number, name:string}){
    this.sportTypesService.setContentType(contentType)
    window.location.reload()
  }

  
  
  getAllSportCategory(){
    if(!this.sportTypesService.getContentTypeInLocalStorage()){
      this.sportTypesService.getAllSportCategory().pipe().subscribe((res:any)=>{
       this.sportTypesService.selectSportCategory.next(true)
        this.contentTypes = res.content_types
      })
    }
    else{
      this.sportTypesService.getAllSportCategory().pipe().subscribe((res:any)=>{
             this.contentTypes = res.content_types
      })
    }
  }

  getLastVersion(){
     let version:any = false
    getAppVersion().then((res)=>{
        version = res
        const platform = Capacitor.getPlatform();
         if(!!version){
          this.versionService.getLastVersion().pipe().subscribe((res:any)=>{
            if(res.version && res.version.version_number){
              this.userHaveCurrentVersion = this.cleanNumberInPoint(version) >= this.cleanNumberInPoint(res.version.version_number)
             }
           })
        }else{
       
        }
    })
    
  }
  userService:UserService = inject(UserService)
  cupService:CupService = inject(CupService)

  askForNotifications() {
    if (Capacitor.getPlatform() === 'web') {
      this.fcmService.requestPermission();
    } else if (Capacitor.getPlatform() === 'android') {
      this.initPushNotifications();
    }
  }
  ngOnInit() {
    // console.log(this.stringHaveCurrentWords('50 см3','Коляски 7 50 см3'))
    this.getLastVersion()
    this.sportTypesService.selectSportCategory.subscribe((res)=>{
      this.sportCategoryModalState = res
    })
    this.getAllSportCategory()
    
    this.userService.getChangeRoles().pipe().subscribe((res:any)=>{
      this.userService.allRoles = res.role
    })
    this.userService.refreshUser();
    this.cupService.getAllDegree().subscribe((res:any)=>{
      this.cupService.allDegree.next(res.degree) 
    })
    // инициализация  push для web
    if (Capacitor.getPlatform() === 'web') {
      this.fcmService.requestPermission();
    } else if (Capacitor.getPlatform() === 'android') {
      this.initPushNotifications();
    }
  }
}