import { Component, inject, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { CheckInFormComponent } from '@app/Shared/Components/Forms/check-in-form/check-in-form.component'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { IonContent, NavController } from '@ionic/angular/standalone'

@Component({
  selector: 'app-create-results-page',
  templateUrl: './create-results-page.component.html',
  styleUrls: ['./create-results-page.component.scss'],
  imports: [IonContent, HeaderComponent, IconButtonComponent, CheckInFormComponent],
})
export class CreateResultsPageComponent implements OnInit {
  constructor() {}
  navController: NavController = inject(NavController)
  ngOnInit() {}
  checkInForm = new FormGroup({
    checkInName: new FormControl<string>('', { nonNullable: true }),
  })
  onCheckInFormChange(event: FormGroup) {
    console.log(this.checkInForm.value)
  }
  back() {
    this.navController.back()
  }
}
