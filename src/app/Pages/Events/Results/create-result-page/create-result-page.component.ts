import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IonContent } from '@ionic/angular/standalone'

@Component({
  selector: 'app-create-result-page',
  templateUrl: './create-result-page.component.html',
  styleUrls: ['./create-result-page.component.scss'],
  imports: [IonContent, HeaderComponent],
})
export class CreateResultPageComponent implements OnInit {
  constructor() {}
  back() {
    console.log('back')
  }
  ngOnInit() {}
}
