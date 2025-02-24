
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { UserService } from './Shared/Data/Services/User/user.service';
import { MetrikaModule } from 'ng-yandex-metrika';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,],
})

export class AppComponent {
  constructor() {}
  userService:UserService = inject(UserService)
  ngOnInit() {
    this.userService.refreshUser();
    
  }
}
