import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController, IonModal, IonContent, IonToolbar, IonTitle, IonFooter, IonButton, IonHeader } from '@ionic/angular/standalone';
import { UserService } from './Shared/Data/Services/User/user.service';
import { MetrikaModule } from 'ng-yandex-metrika';
import  moment, { Moment, MomentInput, version } from 'moment'
import { CupService } from './Shared/Data/Services/cup.service';
import { Capacitor } from '@capacitor/core';
import { VersionService } from './Shared/Data/Services/version.service';
import { IconButtonComponent } from "./Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
async function getAppVersion() {
  if (Capacitor.isNativePlatform()) {
    const info = await App.getInfo();
    return info.version;
  } 
  return false
}



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonHeader, IonButton, IonFooter, IonTitle, IonToolbar, IonContent, IonModal, IonApp, IonRouterOutlet, IconButtonComponent],
})

export class AppComponent {
  private startTimeInBackground?: Moment;
  private finishTimeInBackground?: Moment;
  navController: NavController = inject(NavController)
  versionService:VersionService = inject(VersionService)
  userHaveCurrentVersion:boolean = true
  constructor(private navCtrl: NavController, private router: Router) {
    
    // App.addListener('resume', () => { 
    //   this.finishTimeInBackground = moment()
    //     // console.log(`Приложение снова активно`);
    //     // console.log(this.finishTimeInBackground.format('HH:mm:ss'))
    //     if (this.startTimeInBackground) {
    //       const diffInSeconds = this.finishTimeInBackground.diff(this.startTimeInBackground, 'seconds');
    //       // console.log(`Приложение было в фоновом режиме ${diffInSeconds} секунд`);
    //       if(diffInSeconds>20){
    //         window.location.reload();
    //         // console.log(`Отправили на ту же страницу`);
    //       }
    //     }
    // });

  //   App.addListener('pause', () => { 
  //     this.startTimeInBackground = moment()
  //     // console.log(`Приложение ушло в фон`);
  //     // console.log(this.startTimeInBackground.format('HH:mm:ss'))
  // });
  }
   onUpdate() {
    const platform = Capacitor.getPlatform();

    if (platform === 'ios') {
      window.open('https://apps.apple.com/app/your-app-id', '_system'); // ссылка на App Store
    } else if (platform === 'android') {
      window.open('https://play.google.com/store/apps/details?id=your.package.name', '_system'); // ссылка на Google Play
    } else {
      location.reload(); // для PWA/web
    }
  }
  getLastVersion(){
     let version:any = false
    getAppVersion().then((res)=>{
        version = res
         if(!!version){
          this.versionService.getLastVersion().pipe().subscribe((res:any)=>{
            if(res.version && res.version.version_number){
              this.userHaveCurrentVersion = version == res.version.version_number
             }
           })
        }else{
          console.log('web')
          console.log(version)
        }
    })
    
  }
  userService:UserService = inject(UserService)
  cupService:CupService = inject(CupService)
  ngOnInit() {
   
    this.getLastVersion()

 
    this.userService.getChangeRoles().pipe().subscribe((res:any)=>{
      this.userService.allRoles = res.role
    })
    this.userService.refreshUser();
    this.cupService.getAllDegree().subscribe((res:any)=>{
      this.cupService.allDegree.next(res.degree) 
    })
  }
}
        // let diff = moment().diff(moment(this.lastBackgroundTime), 'seconds');
        // console.log(`Active - diff ${diff}`);
        // if(diff>=20){
          // console.log(diff)
          // window.location.reload()
          // console.log('Приложение обновилось')
        // }
        
      // }
      // else if(state.) {
      //   this.lastBackgroundTime = moment().format('HH:mm:ss');
      //   console.log(`Приложение свернуто`);
      //   console.log(this.lastBackgroundTime);
      // }