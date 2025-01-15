import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent  implements OnInit {
  navController:NavController = inject(NavController)
  constructor() { }

  backNavigate() {
    this.navController.back();
  }
  ngOnInit() {}

}
