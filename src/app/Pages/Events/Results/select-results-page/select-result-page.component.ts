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
  storeResultsService: StoreReslutsService = inject(StoreReslutsService)
  loadingService: LoadingService = inject(LoadingService)
  event!: IEvent
  back() {
    this.navController.back()
  }
  navigateInCreate(grade: Grade) {
    this.navController.navigateForward(`/create-result-race/${grade.id}/${grade.name}/${this.storeResultsService.getCurrentRace()?.id}`)
  }

  getEvent(eventId: string) {
    this.loadingService.showLoading().then((load: HTMLIonLoadingElement) => {
      this.eventService
        .getEventById(eventId)
        .pipe(finalize(() => this.loadingService.hideLoading(load)))
        .subscribe((event: any) => {
          this.storeResultsService.setCurrentRace(event.race)
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
