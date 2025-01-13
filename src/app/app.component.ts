import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, TuiRoot, TuiRoot],
})
export class AppComponent {
  constructor() {}
}
