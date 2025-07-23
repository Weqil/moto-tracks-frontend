import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { StandartInputComponent } from '../../UI/LinarikUI/forms/standart-input/standart-input.component'
import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component'
import { retsultsApplicationsGet } from '@app/Shared/Data/Interfaces/resultsApplications'

interface CheckInForm {
  checkInName: FormControl<string>
}

type ApplicationForm = FormGroup<{
  name: FormControl<string>
  start_number: FormControl<string>
  appointmentId: FormControl<Number>
  scores: FormControl<number>
  arrival: FormControl<number>
}>

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss'],
  imports: [StandartInputComponent, IconButtonComponent, ReactiveFormsModule, StandartInputComponent],
})
export class CheckInFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  applicationsForm!: FormArray<ApplicationForm>
  @Input() checkInForm!: FormGroup<CheckInForm>
  @Output() checkInFormChange = new EventEmitter<FormGroup<CheckInForm>>()
  @Input() set allApplications(value: retsultsApplicationsGet[]) {
    if (value) {
      this.applicationsForm = this.fb.array(
        value.map((application) => {
          return this.fb.group({
            name: new FormControl<string>(
              (application.name || application.user?.personal?.name || '') +
                ' ' +
                (application.surname || application.user?.personal?.surname || '') +
                ' ' +
                (application.patronymic || application.user?.personal?.patronymic || ''),
              { nonNullable: true },
            ),
            start_number: new FormControl<string>(application.start_number || application.user?.personal?.start_number || '', {
              nonNullable: true,
            }),
            appointmentId: new FormControl<Number>(application.id, { nonNullable: true }),
            scores: new FormControl<number>(0, { nonNullable: true }),
            arrival: new FormControl<number>(0, { nonNullable: true }),
          })
        }),
      )
    }
  }
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
