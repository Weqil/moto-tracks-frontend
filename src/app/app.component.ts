import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { UserService } from './Shared/Data/Services/User/user.service';
import { MetrikaModule } from 'ng-yandex-metrika';
import  moment, { Moment, MomentInput } from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})

export class AppComponent {
  private startTimeInBackground?: Moment;
  private finishTimeInBackground?: Moment;
  navController: NavController = inject(NavController)
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
  
  userService:UserService = inject(UserService)
  ngOnInit() {
    this.userService.getChangeRoles().pipe().subscribe((res:any)=>{
      this.userService.allRoles = res.role
    })
    this.userService.refreshUser();
    
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