import { ResultsService } from './../../../../Shared/Data/results.service'
import { OfflineRacersService } from './../../../../Shared/Data/Services/Race/offline-racers.service'
import { Component, inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { CheckInFormComponent } from '@app/Shared/Components/Forms/check-in-form/check-in-form.component'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { Grade } from '@app/Shared/Data/Interfaces/grade'
import { EventService } from '@app/Shared/Data/Services/Event/event.service'
import { IonContent, NavController } from '@ionic/angular/standalone'
import { finalize, forkJoin, map, Observable, tap, toArray } from 'rxjs'
import { StoreReslutsService } from '../store-resluts.service'
import { LoadingService } from '@app/Shared/Services/loading.service'
import { ApplicationFilters } from '@app/Shared/Data/Interfaces/filters/application.filter.interface'
import { event } from 'yandex-maps'
import { retsultsApplicationsGet } from '@app/Shared/Data/Interfaces/resultsApplications'
import { filter } from 'lodash'

@Component({
  selector: 'app-create-results-page',
  templateUrl: './create-results-page.component.html',
  styleUrls: ['./create-results-page.component.scss'],
  imports: [IonContent, HeaderComponent, IconButtonComponent, CheckInFormComponent],
})
export class CreateResultsPageComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)

  OfflineRacersService: OfflineRacersService = inject(OfflineRacersService)
  loadingService: LoadingService = inject(LoadingService)
  applicationsFilters!: ApplicationFilters
  resultsService: ResultsService = inject(ResultsService)
  storeResultsService: StoreReslutsService = inject(StoreReslutsService)
  grade!: Grade
  checkInForm = new FormGroup({
    checkInName: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
  })

  allApplications: retsultsApplicationsGet[] = []

  onCheckInFormChange(event: any) {
    this.loadingService.showLoading().then((load: HTMLIonLoadingElement) => {
      this.resultsService
        .createResults(String(this.storeResultsService.getCurrentRace()?.id), event)
        .pipe(finalize(() => this.loadingService.hideLoading(load)))
        .subscribe((response: any) => {
         this.navController.back()
        })
    })
  }
  back() {
    this.navController.back()
  }
  getAppoyments(): Observable<any> {
    return forkJoin([this.getOfflineRacers(), this.getOnlineRacers()]).pipe(
      tap((event) => {
      }),
      map((applicationsArray: any[]) => {
        return applicationsArray[0].concat(applicationsArray[1])
      }),
    )
  }

  getOnlineRacers(): Observable<any> {
    return this.eventService.getApplicationsForCommisson(String(this.storeResultsService.getCurrentRace()?.id), this.applicationsFilters).pipe(
      tap((event) => {}),
      map((event: any) => {
        return event.users
      }),
      map((users: any[]) => users.filter((user) => !!user.user)),
    )
  }

  getOfflineRacers(): Observable<any> {
    return this.OfflineRacersService.getOfflineRacer(String(this.storeResultsService.getCurrentRace()?.id), this.applicationsFilters).pipe(
      tap((event) => {}),
      map((event: any) => {
        return event.appointments
      }),
    )
  }

  getEvent(eventId: string): Observable<any> {
    return this.eventService.getEventById(eventId).pipe(
      tap((event: any) => {
        this.storeResultsService.setCurrentRace(event.race)
      }),
    )
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.grade = {
        id: params.gradeId,
        name: params.gradeName,
        description: '',
      }
      this.applicationsFilters = {
        gradeId: params.gradeId,
      }
      this.loadingService.showLoading().then((load: HTMLIonLoadingElement) => {
        if (this.storeResultsService.getCurrentRace()?.id) {
          this.getAppoyments()
            .pipe(finalize(() => this.loadingService.hideLoading(load)))
            .subscribe((event: any) => {
              this.allApplications = event
            })
        } else {
          this.getEvent(params.raceId).subscribe((event) => {
            this.getAppoyments()
              .pipe(finalize(() => this.loadingService.hideLoading(load)))
              .subscribe((event: any) => {
                this.allApplications = event
              })
          })
        }
      })
    })
  }
}
