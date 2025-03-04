import { App } from '@capacitor/app';

import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserService } from './Shared/Data/Services/User/user.service';
import  moment, { MomentInput } from 'moment'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})

export class AppComponent {
  private lastBackgroundTime: MomentInput  = moment()
  constructor() {
    
    App.addListener('appStateChange', (state) => { //отслеживается состояние приложения в фоне оно или нет, если в фоне мы записываем этот 
      //момент в переменную и при выходе из фона мы из текущего момента вычитаем переменную и если разница, нахождение в фоне 
      //было более 2 минут то мы перезагружаем приложение
      if (state.isActive) {
        
        let diff = moment().diff(moment(this.lastBackgroundTime), 'minutes');
        console.log(`Active - diff ${diff}`);
        if(diff>=20){
          console.log(diff)
          window.location.reload()
          // console.log('Приложение обновилось спустя')
        }
        
      }else {
        this.lastBackgroundTime = moment()
        // console.log(`Приложение свернуто`);
      }

    });
  }
  
  userService:UserService = inject(UserService)
  ngOnInit() {
    this.userService.refreshUser();
  }
}
