import { Component, effect, ElementRef, inject, input, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IEvent } from '@app/Shared/Data/Interfaces/event'
import { AuthService } from '@app/Shared/Data/Services/Auth/auth.service'
import { EventService } from '@app/Shared/Data/Services/Event/event.service'
import { UserService } from '@app/Shared/Data/Services/User/user.service'

import { LoadingService } from '@app/Shared/Services/loading.service'
import { catchError, debounceTime, delay, EMPTY, finalize, map, Observable, Subject, takeUntil, tap } from 'rxjs'
import { HeaderModule } from '../../Shared/Modules/header/header.module'
import { IonModal, NavController, Platform, IonContent } from '@ionic/angular/standalone'
import { isNull } from 'lodash'
import { UserModule } from '../../Shared/Modules/user/user.module'
import { CommonModule } from '@angular/common'
import { User } from '@app/Shared/Data/Interfaces/user-model'
import { UserViewPageComponent } from '../Users/user-view-page/user-view-page.component'
import { Documents } from '@app/Shared/Data/Interfaces/document-models'
import { IconButtonComponent } from '../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { StandartInputComponent } from '../../Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component'
import { StandartInputSelectComponent } from '../../Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component'
import { StandartRichInputComponent } from '../../Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component'
import { RegionsSelectModalComponent } from '../../Shared/Components/Modals/regions-select-modal/regions-select-modal.component'
import moment, { invalid } from 'moment'
import { sportRankItems } from '@app/Shared/Сonstants/sportValues'
import { CheckBoxComponent } from '../../Shared/Components/UI/LinarikUI/forms/check-box/check-box.component'
import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { PrivateFilesComponent } from '../../CommonUI/Pages/private-files/private-files.component'
import { StandartButtonComponent } from '@app/Shared/Components/UI/Buttons/standart-button/standart-button.component'
import { serverError } from '@app/Shared/Data/Interfaces/errors'
import { motoStampItems } from '@app/Shared/Сonstants/sportValues'
import { formdataService } from 'src/app/Shared/Helpers/formdata.service'

import { ALL_CHECK_LABELS } from '@app/Shared/Data/Interfaces/application-check'
import { NavbarVisibleService } from '@app/Shared/Services/navbar-visible.service'
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service'
import { SelectComandsComponent } from '@app/Shared/Components/Commands/select-comands/select-comands.component'
import { ToastService } from '@app/Shared/Services/toast.service'
import { ICommand, ICommandCreate } from '@app/Shared/Data/Interfaces/command'
import { ComandsService } from '@app/Shared/Data/Services/Comands/comands.service'
import { InputErrorService } from '@app/Shared/Services/input-error.service'
import { OfflineRacersService } from '@app/Shared/Data/Services/Race/offline-racers.service'
import { ApplicationFilters } from '@app/Shared/Data/Interfaces/filters/application.filter.interface'

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}

@Component({
  selector: 'app-application-for-race',
  templateUrl: './application-for-race.component.html',
  styleUrls: ['./application-for-race.component.scss'],
  imports: [
    CommonModule,
    IonContent,
    HeaderModule,
    UserModule,
    UserViewPageComponent,
    IconButtonComponent,
    StandartInputComponent,
    StandartInputSelectComponent,
    StandartRichInputComponent,
    RegionsSelectModalComponent,
    CheckBoxComponent,
    SafeUrlPipe,
    PrivateFilesComponent,
    IonModal,
    StandartButtonComponent,
    SelectComandsComponent,
    ReactiveFormsModule,
  ],
})
export class ApplicationForRaceComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute)
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  private readonly destroy$ = new Subject<void>()
  loadingService: LoadingService = inject(LoadingService)
  userService: UserService = inject(UserService)
  toastService: ToastService = inject(ToastService)
  commandService: ComandsService = inject(ComandsService)
  formdataService: formdataService = inject(formdataService)
  offlineRacersService: OfflineRacersService = inject(OfflineRacersService)
  createCommandTemp!: ICommand
  inputErrorService: InputErrorService = inject(InputErrorService)
  offlineAppointments: any = []
  navBarVisibleService: NavbarVisibleService = inject(NavbarVisibleService)
  loaderService: LoadingService = inject(LoadingService)
  mapService: MapService = inject(MapService)

  authService: AuthService = inject(AuthService)
  activeAppId: any
  sportRankItems = sportRankItems
  motoStampItems = motoStampItems
  constructor(private router: Router) {}
  raceUser!: User
  eventId: string = ''
  event!: IEvent
  allComands: any[] = []
  selectRegionInCommandModal: any = {}

  groupItems: { name: string; value: string }[] = []
  usersInRace: any = []
  usersPreview: any[] = []
  groups: any = []
  applicationsFilters = signal<ApplicationFilters>({})
  createRegionItems: any[] = []
  @ViewChild('searchInput') searchInput!: any
  searchRegionItems: any[] = []
  sortUsers: any = {}
  viewUser: boolean = false
  _filtersEffect = effect(() => {
    console.log('изменил сигнал')
    const applicationFilters = this.applicationsFilters()
    if (this.event) {
      this.getUsersInRace()
      this.getOfflineRacer()
    }
  })
  viewUserOffline: boolean = false
  userGetId!: string
  userGet!: any
  tableModalValue: boolean = false
  googleTabsLink: string = ''
  arrayDocument: Documents[] = []
  licensed: any
  notarius: any
  polis: any
  activeUserId: any
  licensesFile: any = ''
  polisFile: any = ''
  notariusFile: any = ''
  regionModalState: boolean = false
  comandSelectModalStateValue: boolean = false
  userInfo: boolean = false
  raceInfo: boolean = false
  docInfo: boolean = false
  licensedInfo: boolean = false
  polisInfo: boolean = false
  notariusInfo: boolean = false
  OfflineRacerAddFormState: boolean = false
  activeDocument?: number
  viewDocumentValue: boolean = false
  appForComission: any = []

  usersPreviewConfig: { usersCount: number } = {
    usersCount: 0,
  }
  users: any
  formattedUsers: { users: User[] }[] = []

  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    commandId: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    rank: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    rankNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    community: new FormControl('Лично', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    coach: new FormControl('', [Validators.required]),
    motoStamp: new FormControl('', [Validators.required]),
    engine: new FormControl('', [Validators.required]),
    numberAndSeria: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  })

  addOfflineUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    patronymic: new FormControl('', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    commandId: new FormControl(''),
    gradeId: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    rank: new FormControl('', [Validators.required]),
    community: new FormControl('Лично', [Validators.required]),
    motoStamp: new FormControl('', [Validators.required]),
    licenseNumber: new FormControl('', [Validators.required]),
  })
  viewOfflineUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    patronymic: new FormControl('', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    commandId: new FormControl(''),
    gradeId: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    rank: new FormControl('', [Validators.required]),
    community: new FormControl('Лично', [Validators.required]),
    motoStamp: new FormControl('', [Validators.required]),
    licenseNumber: new FormControl('', [Validators.required]),
  })

  formErrors: any = {
    name: {
      errorMessage: '',
    },
    patronymic: {
      errorMessage: '',
    },
    dateOfBirth: {
      errorMessage: '',
    },
    inn: {
      errorMessage: '',
    },
    snils: {
      errorMessage: '',
    },
    phoneNumber: {
      errorMessage: '',
    },
    startNumber: {
      errorMessage: '',
    },
    group: {
      errorMessage: '',
    },
    rank: {
      errorMessage: '',
    },

    surname: {
      errorMessage: '',
    },
    region: {
      errorMessage: '',
    },
    city: {
      errorMessage: '',
    },
    community: {
      errorMessage: '',
    },
    motoStamp: {
      errorMessage: '',
    },
    engine: {
      errorMessage: '',
    },
    numberAndSeria: {
      errorMessage: '',
    },
    email: {
      errorMessage: '',
    },
  }

  documentsError: any = {
    polisNumber: {
      errorMessage: '',
    },
    issuedWhom: {
      errorMessage: '',
    },
    itWorksDate: {
      errorMessage: '',
    },
    polisFile: {
      errorMessage: '',
    },
  }

  searchApplicationForm = new FormGroup({
    search: new FormControl(''),
  })

  checkDocument(documentId: number) {
    this.activeDocument = documentId
    this.viewDocumentValue = true
  }

  ionViewWillEnter() {
    this.getRegions()
    this.getAllComands()
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => {}))
      .subscribe((params) => {
        this.eventId = params['id']
        this.getEvent()
        this.getUsersInRace()
      })
    this.getOfflineRacer()
  }

  getEvent() {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => {
      loader = res
    })
    this.eventService
      .getEventById(this.eventId, {
        userId: String(this.userService.user.value?.id ? this.userService.user.value?.id : ''),
        appointmentUser: 1,
      })
      .pipe(
        finalize(() => {
          this.loadingService.hideLoading(loader)
        }),
      )
      .subscribe((res: any) => {
        this.raceUser = res.race.user
        this.event = res.race
        this.groupItems = this.event.grades
      })
  }

  back() {
    this.navController.navigateRoot('/events')
  }

  updateGradeFilters(gradeId: number | '') {
    this.applicationsFilters.update((filters: ApplicationFilters) => {
      if (gradeId) {
        return {
          ...filters,
          gradeId: gradeId,
        }
      } else {
        let tempObject = { ...filters }
        delete tempObject.gradeId
        return {
          ...tempObject,
        }
      }
    })
  }

  closetTableModal() {
    this.tableModalValue = false
  }
  isDateBeforeCurrent(date: any): boolean {
    const givenMoment = moment(date.value, 'DD.MM.YY')
    const currentMoment = moment()
    return givenMoment < currentMoment
  }

  checkStateInInput(labelName: string): boolean {
    if (this.userGet.user.personal.comment && this.userGet.user.personal.comment[labelName]) {
      return !!this.userGet.user.personal.comment[labelName]
    }
    return false
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

  checkInput(event: any, labelName: string) {
    if (this.userGet.user.personal.comment && typeof this.userGet.user.personal.comment == 'object') {
      this.userGet.user.personal.comment[labelName] = !event.state
    } else {
      this.userGet.user.personal.comment = {
        [labelName]: !event.state,
      }
    }
    this.personalUserForm.patchValue({
      comment: JSON.stringify(this.userGet.user.personal.comment),
    })
  }

  getUsersInRace() {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => (loader = res))
    this.eventService
      .getApplicationsForCommisson(this.eventId, this.applicationsFilters())
      .pipe(finalize(() => this.loaderService.hideLoading(loader)))
      .subscribe((res: any) => {
        this.usersInRace = res.users
        this.usersInRace.map((user: any) => {
          if (user.user && user.user.personal.comment) {
            let parceComment = {}
            try {
              parceComment = JSON.parse(user.user.personal.comment)
              user.user.personal.comment = parceComment
            } catch (err) {
              user.user.personal.comment = {}
            }
          } else {
            if (user.user) {
              user.user.personal.comment = {}
            }
          }
        })
        this.formattedUsers = []

        // Object.keys(this.usersInRace).forEach((key: string) => {
        //   this.formattedUsers.push({
        //     users: this.usersInRace[key]
        //   });
        // });

        // if(this.usersInRace){
        //   Object.keys(this.usersInRace).forEach((res:any)=>{
        //   let tempArray:any = Array(this.usersInRace[res])[0]
        //    this.usersPreviewConfig.usersCount += tempArray.length

        //   })
        // }
        if (this.userGet) {
          let currentUser = this.usersInRace.find((user: any) => user.id == this.userGet.id)
          this.navigateToUser(currentUser.user_id, currentUser, currentUser.id)
        }
      })
  }

  licensesForm: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.minLength(1)]), //номер лицензии
  })

  polisForm: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required]), //Серия и номер полиса
    issuedWhom: new FormControl('', [Validators.required]), //Кем выдан
    itWorksDate: new FormControl('', [Validators.required]), //Срок действия
  })

  setEngine(event: any) {
    this.addOfflineUserForm.patchValue({ engine: event.name })
  }

  setRank(event: any) {
    this.addOfflineUserForm.patchValue({ rank: event.name })
  }

  async setUserComeInRace(application: any) {
    let loader = await this.loaderService.showLoading()

    this.userService
      .userComeInRace(application.id, !!!application.has_come)
      .pipe(finalize(() => this.loaderService.hideLoading(loader)))
      .subscribe(() => {
        this.getUsersInRace()
      })
  }

  setMotoStamp(event: any) {
    this.addOfflineUserForm.patchValue({ motoStamp: event.name })
  }

  doumentCheck(value: any, document: any) {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => {
      loader = res
    })
    this.userService
      .checkedDocument(document.id, { checked: !value.state })
      .pipe(finalize(() => this.loaderService.hideLoading(loader)))
      .subscribe((res: any) => {
        this.getUsersInRace()
      })
  }

  notariusForm: FormGroup = new FormGroup({
    notariusFile: new FormControl('', [Validators.required]), // путь до файла
  })

  navigateToUser(userId: string, userGet: User, appId: any) {
    this.userGetId = userId
    this.userGet = userGet
    this.getDocumentUserById()
    this.setUserInForm()
    this.activeUserId = userId
    this.activeAppId = appId
    this.viewDocumentValue = false
  }

  setActiveAppId(appoyment: any) {
    this.activeAppId = appoyment.id
  }

  generateGoogleLink(eventId: any, hasCome?: boolean) {
    this.loadingService.showLoading()
    this.eventService
      .generateGoogleLink(eventId, hasCome)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .subscribe((res: any) => {
        this.tableModalValue = true
        this.googleTabsLink = res.table_url
      })
  }

  closeGoogleTable(){
    this.tableModalValue = false
  }

  openOfflineRacerAddForm() {
    this.OfflineRacerAddFormState = true
  }

  closeOfflineRacerAddForm() {
    this.OfflineRacerAddFormState = false
  }
  cancelCreateOffline() {
    this.OfflineRacerAddFormState = false
    this.addOfflineUserForm.reset()
  }

  closeOfflineRacerAddFormWithDataForm() {
    this.OfflineRacerAddFormState = false
  }

  openComandSelectModalStateValue() {
    this.OfflineRacerAddFormState = false
    this.comandSelectModalStateValue = true
  }

  saveOfflineRacer(addAlso: boolean = false) {
    this.addOfflineUserForm.markAllAsTouched()
    if (this.addOfflineUserForm.valid) {
      this.createOfflineRacer().subscribe((res: any) => {
        this.toastService.showToast('Заявка успешно создана', 'success')
        this.getOfflineRacer()
        if (addAlso) {
          this.addOfflineUserForm.reset()
        } else {
          this.closeOfflineRacerAddForm()
          this.addOfflineUserForm.reset()
        }
      })
    }
  }

  createOfflineRacer(): Observable<any> {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => (loader = res))
    return this.offlineRacersService
      .createOfflineRacer(Number(this.eventId), this.addOfflineUserForm.value)
      .pipe(finalize(() => this.loaderService.hideLoading(loader)))
  }

  getOfflineRacer() {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => (loader = res))
    return this.offlineRacersService
      .getOfflineRacer(Number(this.eventId), this.applicationsFilters())
      .pipe(finalize(() => this.loaderService.hideLoading(loader)))
      .subscribe((res: any) => {
        this.offlineAppointments = res.appointments
      })
  }

  saveAndAddNew() {}

  generatePdfInAplication() {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((load) => (loader = load))
    this.eventService
      .generatePdfForAplication(this.userGet.id)
      .pipe(
        tap((res: Blob) => {
          if (res.size === 0) {
          } else {
            const blobUrl = URL.createObjectURL(res)
            const newWindow = window.open(blobUrl, '_blank')
            newWindow?.addEventListener('load', () => {
              newWindow.print()
            })
            URL.revokeObjectURL(blobUrl)
          }
        }),
        map((res: any) => {}),
        finalize(() => this.loaderService.hideLoading(loader)),
        catchError((err: any) => {
          if (err.status == 200) {
          }
          return EMPTY
        }),
      )
      .subscribe((res: any) => {})
  }

  getDocumentUserById() {
    this.licensed = null
    this.licensesFile = null

    this.polis = null
    this.polisFile = null

    this.notarius = null
    this.notariusFile = null
    let res
    try {
      res = this.userGet.documents
    } catch (err) {
      res = []
    }

    if (res.length)
      if (res.find((doc: any) => doc.type === 'licenses')) {
        let licensesDocument = res.find((doc: any) => doc.type === 'licenses')
        this.licensesForm.patchValue(res.find((doc: any) => doc.type === 'licenses'))
        this.licensesFile = { name: 'Лицензия загружена', dontFile: true }
        this.licensed = licensesDocument
      }
    if (res.find((doc: any) => doc.type === 'polis')) {
      let polis = res.find((doc: any) => doc.type === 'polis')
      this.polisForm.patchValue({
        number: polis.number,
        issuedWhom: polis.issued_whom,
        itWorksDate: polis.it_works_date,
      })
      this.polisFile = { name: 'Полис загружен', dontFile: true }
      this.polis = polis
    }
    if (res.find((doc: any) => doc.type === 'notarius')) {
      let notarius = res.find((doc: any) => doc.type === 'notarius')
      this.notariusFile = { name: 'Согласие загружено', dontFile: true }
      this.notarius = notarius
    }
    // Только теперь открываем компонент
    this.viewUser = true
    this.viewUserOffline = false
  }

  showOfflineUserForm(offlineUser: any) {
    this.setActiveAppId(offlineUser)
    this.viewUserOffline = true
    this.viewDocumentValue = false
    this.viewUser = false
    // asdasdasd
    //  name: personal.name || '',
    //     surname: personal.surname || '',
    //     grade: this.userGet.grade?.name || '',
    //     dateOfBirth: personal.date_of_birth || '',
    //     phoneNumber: cleanedPhone,
    //     startNumber: personal.start_number || '',
    //     locationId: personal.location?.id || '',
    //     region: personal.location?.name ? personal.location.name : '',
    //     community: personal.community || '',
    //     rank: personal.rank || '',
    //     engine: personal.engine || '',
    //     motoStamp: personal.moto_stamp || '',
    //     numberAndSeria: personal.number_and_seria || '',
    //     group: '',
    this.viewOfflineUserForm.patchValue({
      ...offlineUser,
      startNumber: offlineUser.start_number,
      dateOfBirth: offlineUser.date_of_birth,
      licenseNumber: offlineUser.license_number,
      motoStamp: offlineUser.moto_stamp,
      group: offlineUser.grade.name,
      region: offlineUser.location?.name,
    })
  }

  closeComandSelectModalStateValue() {
    this.comandSelectModalStateValue = false
  }

  setComand(event: any) {
    this.closeComandSelectModalStateValue()
    this.openOfflineRacerAddForm()
    this.addOfflineUserForm.patchValue({ community: event.name })
    this.addOfflineUserForm.patchValue({ commandId: event.id })
  }

  getAllComands() {
    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => {
      loader = res
    })
    this.commandService
      .getComands()
      .pipe(
        finalize(() => {
          this.loaderService.hideLoading(loader)
        }),
      )
      .subscribe((res: any) => {
        this.allComands = []
        this.allComands.push({ id: '', name: 'Лично', region: 'papilapup' })

        if (this.createCommandTemp) {
          this.allComands.push(...res.commands.filter((command: ICommand) => command.id == this.createCommandTemp.id))
          this.allComands.push(...res.commands.filter((command: ICommand) => command.id !== this.createCommandTemp.id))
        } else {
          this.allComands.push(...res.commands)
        }
      })
  }

  createNewComand(formData: { id: number; name: string; city: string; locationId: number; region: string }) {
    const id = formData.id
    const region = formData.region
    const name = formData.name
    const locationId = formData.locationId
    const city = formData.city

    if (!name || !city || !locationId) {
      this.toastService.showToast('Заполните все поля перед созданием команды', 'warning')
      return
    }

    let loader: HTMLIonLoadingElement
    this.loaderService.showLoading().then((res: HTMLIonLoadingElement) => {
      loader = res
    })

    let user: User | null = this.userService.user.value
    let commandValidateState: boolean = false
    let command: ICommandCreate = {
      id: id,
      name: name,
      locationId: locationId,
      city: city,
      region: region,
    }
    if (user) {
      Object.keys(command).forEach((key: any) => {
        commandValidateState = !!command[key as keyof typeof command]
      })
      if (commandValidateState) {
        let fd: FormData = new FormData()
        fd = this.formdataService.formdataAppendJson(fd, command)
        this.commandService
          .createComand(fd)
          .pipe(
            finalize(() => {
              this.loaderService.hideLoading(loader)
            }),
          )
          .subscribe((res: any) => {
            this.setComand(res.command)
            // this.getAllComands()
          })
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  setUserInForm() {
    if (this.userGet && this.userGet.user.personal) {
      this.personalUserForm.patchValue(this.userGet.user.personal)
      const personal = this.userGet.user.personal

      const rawPhone = personal.phone_number || ''
      const cleanedPhone = parseInt(rawPhone.replace(/\D/g, ''), 10) || ''
      this.personalUserForm.patchValue({
        name: personal.name || '',
        surname: personal.surname || '',
        grade: this.userGet.grade?.name || '',
        dateOfBirth: personal.date_of_birth || '',
        phoneNumber: cleanedPhone,
        startNumber: personal.start_number || '',
        locationId: personal.location?.id || '',
        region: personal.location?.name ? personal.location.name : '',
        community: personal.community || '',
        rank: personal.rank || '',
        engine: personal.engine || '',
        motoStamp: personal.moto_stamp || '',
        numberAndSeria: personal.number_and_seria || '',
        group: '',
      })
    } else {
      this.personalUserForm.reset()
    }
  }

  checkBoxArray: any = [
    {
      value: 1,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
    {
      value: 2,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
    {
      value: 3,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
    {
      value: 4,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
    {
      value: 5,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
    {
      value: 6,
      state: false,
      labelText: '',
      theme: 'white',
      clippy: '',
    },
  ]

  CheckBoxValue(value: boolean) {
    this.userInfo = !value
  }

  sendValidateStateUser() {
    if (this.userGet.user.personal.comment && typeof this.userGet.user.personal.comment == 'object') {
      let truehLength = Object.keys(this.userGet.user.personal.comment).filter((key) => this.userGet.user.personal.comment[key] == true).length

      this.userService
        .checkedPersonalInfo(this.userGet.user.id, {
          check: truehLength == ALL_CHECK_LABELS.length,
          comment: JSON.stringify(this.userGet.user.personal.comment),
        })
        .pipe()
        .subscribe((res: any) => {})
    }
  }
  agreedApp(id: any) {
    this.sendValidateStateUser()
    this.eventService
      .checkApplication(id, 1, '')
      .pipe(finalize(() => {}))
      .subscribe((res: any) => {
        this.getUsersInRace()
      })
  }

  disagreedApp(id: any) {
    this.sendValidateStateUser()
    this.eventService
      .checkApplication(id, 0, '')
      .pipe(finalize(() => {}))
      .subscribe((res: any) => {
        this.getUsersInRace()
      })
  }
  setGroup(event: any) {
    this.addOfflineUserForm.patchValue({ gradeId: event.id, group: event.name })
  }

  openRegionModal() {
    this.regionModalState = true
    this.navBarVisibleService.hideNavBar()
  }
  closeRegionModal() {
    setTimeout(() => {
      this.navBarVisibleService.showNavBar()
    }, 100)
    this.regionModalState = false
  }
  getRegions() {
    this.mapService
      .getAllRegions(false, false, false)
      .pipe()
      .subscribe((res: any) => {
        res.data.forEach((region: any) => {
          this.searchRegionItems.push({
            name: `${region.name} ${region.type}`,
            value: region.id,
          })
        })
      })
  }
  selectRegionInCommandModalFunction(event: any) {
    this.selectRegionInCommandModal = event
  }
  clearRegionInComandFilter() {
    this.selectRegionInCommandModal = {}
  }
  setRegion(region: any) {
    this.closeRegionModal()
    this.addOfflineUserForm.patchValue({ locationId: region.value, region: region.name })
  }

  search() {
    if (this.searchApplicationForm.value.search) {
      this.applicationsFilters.update((filters: ApplicationFilters) => {
        return {
          ...filters,
          name: this.searchApplicationForm.value.search!,
        }
      })
    } else {
    }
  }

  ngOnInit() {
    this.searchApplicationForm.valueChanges.pipe(debounceTime(400)).subscribe((res: any) => {
      if (!!!this.searchApplicationForm.value.search) {
        this.applicationsFilters.update((filters: ApplicationFilters) => {
          let tempFilters = { ...filters }
          delete tempFilters.name
          return {
            ...tempFilters,
          }
        })
      }
    })
  }
}
