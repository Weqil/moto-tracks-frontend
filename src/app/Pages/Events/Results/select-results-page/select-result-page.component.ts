import { Component, inject, OnInit } from '@angular/core'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { IonContent, NavController } from '@ionic/angular/standalone'

@Component({
  selector: 'app-create-result-page',
  templateUrl: './select-result-page.component.html',
  styleUrls: ['./select-result-page.component.scss'],
  imports: [IonContent, HeaderComponent, IconButtonComponent],
})
export class CreateResultPageComponent implements OnInit {
  constructor() {}
  navController: NavController = inject(NavController)
  back() {
    this.navController.back()
  }
  navigateInCreate(gradeId: string) {
    this.navController.navigateForward(`/create-result-race/${gradeId}`)
  }
  ngOnInit() {}
}
