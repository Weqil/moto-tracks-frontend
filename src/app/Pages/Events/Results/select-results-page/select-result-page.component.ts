import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component'
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { EventService } from '@app/Shared/Data/Services/Event/event.service'
import { LoadingService } from '@app/Shared/Services/loading.service'
import { IonContent, NavController } from '@ionic/angular/standalone'
import { finalize } from 'rxjs'
import { StoreReslutsService } from '../store-resluts.service'
import { AsyncPipe } from '@angular/common'
import { IEvent } from 'yandex-maps'
import { Grade } from '@app/Shared/Data/Interfaces/grade'
import { ResultsService } from '@app/Shared/Data/results.service'
import { IArrivals, IArrivalsWithGrades } from '@app/Shared/Data/Interfaces/arrivals'

@Component({
  selector: 'app-create-result-page',
  templateUrl: './select-result-page.component.html',
  styleUrls: ['./select-result-page.component.scss'],
  imports: [IonContent, HeaderComponent, IconButtonComponent],
})
export class CreateResultPageComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  resultsService: ResultsService = inject(ResultsService)
  arrivalWithGrades: IArrivalsWithGrades = { grades: [] }
  storeResultsService: StoreReslutsService = inject(StoreReslutsService)
  loadingService: LoadingService = inject(LoadingService)
  event!: IEvent
  back() {
    this.navController.back()
  }
  navigateInCreate(grade: Grade) {
    this.navController.navigateForward(`/create-result-race/${grade.id}/${grade.name}/${this.storeResultsService.getCurrentRace()?.id}`)
  }

  formattingArrivals(arrivals: IArrivals[]) {
    const formattedArrivals: IArrivalsWithGrades = {
      grades: [],
    }
    let event = this.storeResultsService.getCurrentRace()
    if (!!event) {
      formattedArrivals.grades = event.grades.map((grade) => ({
        id: grade.id,
        name: grade.name,
        description: grade.description,
        arrivals: [],
      }))
    }

    arrivals.forEach((arrival) => {
      const existingGrade = formattedArrivals.grades.find((g) => g.id === arrival.grade_id)
      if (existingGrade) {
        existingGrade.arrivals.push(arrival)
      }
    })
    this.arrivalWithGrades = { grades: formattedArrivals.grades }
    return formattedArrivals
  }

  getArrivals() {
    this.loadingService.showLoading().then((load: HTMLIonLoadingElement) => {
      this.resultsService
        .getArrivals(this.storeResultsService.getCurrentRace()?.id || '')
        .pipe(finalize(() => this.loadingService.hideLoading(load)))
        .subscribe((event: any) => {
          this.formattingArrivals(event.arrivals)
        })
    })
  }

  getEvent(eventId: string) {
    this.loadingService.showLoading().then((load: HTMLIonLoadingElement) => {
      this.eventService
        .getEventById(eventId)
        .pipe(finalize(() => this.loadingService.hideLoading(load)))
        .subscribe((event: any) => {
          this.storeResultsService.setCurrentRace(event.race)
          this.event = event
          this.getArrivals()
        })
    })
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const eventId = params.id
      this.getEvent(eventId)
    })
  }
}
