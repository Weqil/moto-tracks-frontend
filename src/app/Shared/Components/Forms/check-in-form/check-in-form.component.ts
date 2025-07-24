import { InputErrorService } from './../../../Services/input-error.service'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core'
import { StandartInputComponent } from '../../UI/LinarikUI/forms/standart-input/standart-input.component'
import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component'
import { retsultsApplicationsGet } from '@app/Shared/Data/Interfaces/resultsApplications'
import { from, map, toArray } from 'rxjs'

interface CheckInForm {
  checkInName: FormControl<string>
}

type ApplicationForm = FormGroup<{
  name: FormControl<string>
  start_number: FormControl<string>
  appointmentId: FormControl<Number>
  scores: FormControl<number | null>
  arrival: FormControl<string>
  place: FormControl<number | null>
}>

type ApplicationFormValue = ApplicationForm['value']

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss'],
  imports: [StandartInputComponent, IconButtonComponent, ReactiveFormsModule, StandartInputComponent],
})
export class CheckInFormComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  applicationsForm!: FormArray<ApplicationForm>
  writingFocus: boolean = false
  inputErrorService: InputErrorService = inject(InputErrorService)
  formHaveSubscribe: boolean = false
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
            scores: new FormControl<number | null>(null, Validators.required),
            arrival: new FormControl<string>('', { nonNullable: true }),
            place: new FormControl<number | null>(null, Validators.required),
          })
        }),
      )
      this.applicationsForm.controls.forEach((control) => {
        control.valueChanges.subscribe((value) => {
          if (!this.writingFocus) {
            control.patchValue(
              {
                scores: this.getScores(Number(control.get('place')?.value)),
              },
              { emitEvent: false },
            )
          }
        })
      })
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

  getScores(place: number) {
    if (place === 1) {
      return 25
    }
    if (place === 2) {
      return 22
    }
    if (place === 3) {
      return 20
    }
    if (place === 4) {
      return 18
    }
    if (place === 5) {
      return 16
    }
    if (place > 5) {
      if (15 - (place - 6) <= 1) return 1
      return 15 - (place - 6)
    }
    return null
  }

  checkInputInControl(control: AbstractControl | null): { invalid: boolean; message: string } {
    if (control) {
      return this.inputErrorService.checkInputInControl(control)
    } else {
      return {
        invalid: true,
        message: 'control dont create',
      }
    }
  }

  onScoresFocus(formGroup: FormGroup, focus: boolean): void {
    this.writingFocus = focus
  }

  formatingApplicationsForm() {
    from(this.applicationsForm.value)
      .pipe(
        map((application: ApplicationFormValue) => {
          return {
            appointmentId: application.appointmentId,
            scores: application.scores,
            arrival: this.checkInForm.value.checkInName,
            place: application.place,
          }
        }),
        toArray(),
      )
      .subscribe((aplications: any) => {
        this.checkInFormChange.emit(aplications)
      })
  }

  submitForm() {
    this.checkInForm.markAllAsTouched()
    this.applicationsForm.markAllAsTouched()
    if (this.checkInForm.valid && this.applicationsForm.valid) {
      this.formatingApplicationsForm()
    }
  }

  ngOnInit() {}
}
