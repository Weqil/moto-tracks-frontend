import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core'
import { IonContent } from '@ionic/angular/standalone'
import { HeaderModule } from '../../../Shared/Modules/header/header.module'
import { User } from '@app/Shared/Data/Interfaces/user-model'
import { UserService } from '@app/Shared/Data/Services/User/user.service'
import { LoadingService } from '@app/Shared/Services/loading.service'
import { finalize, Subject, takeUntil, tap } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { CheckImgUrlPipe } from '../../../Shared/Helpers/check-img-url.pipe'
import { IonCheckbox, IonModal, NavController, IonLabel } from '@ionic/angular/standalone'
import { IconButtonComponent } from '../../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { CommandSectionComponent } from '../../../Shared/Components/Commands/command-section/command-section.component'
import { ICommand } from '@app/Shared/Data/Interfaces/command'
import { ComandsService } from '@app/Shared/Data/Services/Comands/comands.service'
import { IEvent } from 'src/app/Shared/Data/Interfaces/event'
import { CheckUserRoleService } from '@app/Shared/Data/Services/check-user-role.service'
import { CommonModule } from '@angular/common'
import { EventCardComponent } from '@app/Shared/Components/Event/event-card/event-card.component'
import moment from 'moment'
import { EventService } from '@app/Shared/Data/Services/Event/event.service'
import _ from 'lodash'

@Component({
  selector: 'app-user-view-page',
  templateUrl: './user-view-page.component.html',
  styleUrls: ['./user-view-page.component.scss'],
  imports: [HeaderModule, IonContent, CheckImgUrlPipe, CommonModule, IconButtonComponent, CommandSectionComponent, EventCardComponent],
})
export class UserViewPageComponent implements OnInit {
  user!: User
  userId!: string
  command!: ICommand
  comandService: ComandsService = inject(ComandsService)
  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  eventService: EventService = inject(EventService)
  route: ActivatedRoute = inject(ActivatedRoute)
  userRider: boolean = false
  private readonly destroy$ = new Subject<void>()
  loaderService: LoadingService = inject(LoadingService)
  events!: any
  navController: NavController = inject(NavController)
  @Input() userIdGet!: string
  userTranslitStatuses: string[] = []
  formatedEvents: { groupMonth: string; events: IEvent[] }[] = []
  eventsFilter: any = {
    sort: 'asc',
    locationId: '',
    commissionUser: 1,
  }
  selectedStatusItem!: any
  checkUserRole: CheckUserRoleService = inject(CheckUserRoleService)

  back() {
    this.navController.back()
  }

  constructor() {}

  redirectInComand(team: any) {
    this.navController.navigateForward(`/command/view/${team.id}`)
  }
  getUser(hideLoading: boolean = false) {
    let loader: HTMLIonLoadingElement
    if (!hideLoading) {
      this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => {
        loader = res
      })
    }

    return this.userService.getUserById(this.userId).pipe(
      tap((res: any) => {
        this.user = res.user
        // this.comandId = res.user.personal.com
        this.userTranslitStatuses = this.checkUserRole.getUserRoleNamesInTranslit(this.user)
      }),
      finalize(() => {
        if (!hideLoading) {
          this.loadingService.hideLoading(loader)
        }
      }),
    )
  }
  getEvents() {
    this.eventsFilter.userIdExists = String(this.userId)

    return this.eventService.getAllEvents({ ...this.eventsFilter, userOnlyAppointment: 1 }).pipe(
      tap((res: any) => {
        this.startEvents = res.races
        this.formatedEvents = Object.keys(_.groupBy(this.startEvents, (event: any) => moment(event.date_start).locale('ru').format('MMMM YYYY'))).map(
          (groupMonth) => ({
            groupMonth: groupMonth.charAt(0).toUpperCase() + groupMonth.slice(1),
            events: _.groupBy(this.startEvents, (event: any) => moment(event.date_start).locale('ru').format('MMMM YYYY'))[groupMonth],
          }),
        )
      }),
      finalize(() => {}),
    )
  }

  startEvents() {
    let loader: HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement) => {
      loader = res
    })
    this.eventService
      .getAllEvents({
        userId: String(this.userService.user.value?.id),
        dateStart: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        sortField: 'date_start',
        sort: 'asc',
      })
      .pipe(
        finalize(() => {
          this.loadingService.hideLoading(loader)
        }),
      )
      .subscribe((res: any) => {
        this.events = res.races
      })
  }

  navigateToUser(userId: any) {
    this.navController.navigateRoot(`users/${userId}`)
  }

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.userIdGet) {
      this.userId = this.userIdGet
    } else {
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.userId = params['id']
      })
    }
    this.loadingService.observableLoaderScoup([this.getUser(true), this.getEvents()]).subscribe()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userIdGet'] && changes['userIdGet'].currentValue) {
      this.userId = changes['userIdGet'].currentValue
      this.getUser()
    }
  }
}
