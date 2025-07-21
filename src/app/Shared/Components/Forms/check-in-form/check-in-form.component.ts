import { FormControl, FormGroup } from '@angular/forms'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { StandartInputComponent } from '../../UI/LinarikUI/forms/standart-input/standart-input.component'
import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component'

interface CheckInForm {
  checkInName: FormControl<string>
}

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss'],
  imports: [StandartInputComponent, IconButtonComponent],
})
export class CheckInFormComponent implements OnInit {
  constructor() {}
  @Input() checkInForm!: FormGroup<CheckInForm>
  @Output() checkInFormChange = new EventEmitter<FormGroup<CheckInForm>>()
  @Input() set group(value: any) {
    if (value) {
      this.groupForm.patchValue({ name: value || '' })
    }
  }
  groupForm = new FormGroup({
    name: new FormControl(this.group || ''),
  })

  submitForm() {
    this.checkInFormChange.emit(this.checkInForm)
  }

  ngOnInit() {}
}
