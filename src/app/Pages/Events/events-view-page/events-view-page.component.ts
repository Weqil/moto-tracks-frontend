import { Component, Inject, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackSectionComponent } from "../../../Shared/Components/Track/track-section/track-section.component";
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { UsersPreviewComponent } from 'src/app/Shared/Components/UI/users-preview/users-preview.component';

@Component({
  selector: 'app-events-view-page',
  templateUrl: './events-view-page.component.html',
  styleUrls: ['./events-view-page.component.scss'],
  imports: [SharedModule, SlidersModule, ButtonsModule, TrackSectionComponent,IonModal,HeaderModule, StandartInputComponent,UsersPreviewComponent]
})
export class EventsViewPageComponent  implements OnInit {

  constructor() { }
  
  private readonly destroy$ = new Subject<void>()

  route: ActivatedRoute = inject(ActivatedRoute)
  eventService: EventService = inject(EventService)
  authService: AuthService = inject(AuthService)
  navController: NavController = inject(NavController)
  loadingService: LoadingService = inject(LoadingService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)

  usersInRace:User[] = []
  event!:IEvent
  openUserModalValue:boolean = false
  raceUser!:User
  applicationFormValueState:boolean = false
  userService:UserService = inject(UserService)
  eventId: string = ''
  personalUserForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      patronymic: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      inn: new FormControl('', [Validators.required]),
      snils: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
      startNumber: new FormControl('', [Validators.required]),
      group:new FormControl('', [Validators.required]),
      rank:new FormControl('', [Validators.required]),
      rankNumber:new FormControl('', [Validators.required]),
      community:new FormControl('', [Validators.required]),
      coach:new FormControl('', [Validators.required]),
      motoStamp:new FormControl('', [Validators.required]),
      engine:new FormControl('', [Validators.required]),
    })

    licensesForm: FormGroup = new FormGroup(
      {
        licensesNumber: new FormControl('',[Validators.required, ]), //номер лицензии
        licensesFileLink: new FormControl('',[Validators.required, ]), // путь до файла
      }
    )
  
    polisForm: FormGroup = new FormGroup(
      {
        polisNumber: new FormControl('',[Validators.required, ]), //Серия и номер полиса
        issuedWhom: new FormControl('',[Validators.required, ]), //Кем выдан
        itWorksDate: new FormControl('',[Validators.required, ]), //Срок действия
        polisFileLink: new FormControl('',[Validators.required, ]), // путь до файла
      }
    )
    pasportForm: FormGroup = new FormGroup(
      {
        numberAndSeria: new FormControl('',[Validators.required]), //Серия и номер полиса
        pasportFileLink: new FormControl(''), // путь до файла
      }
    )


    loaderService:LoadingService = inject(LoadingService)
    pasport:any
    licenses:any
    polis:any
    toastService:ToastService = inject(ToastService)

    openStateUsersModal(){
      this.openUserModalValue = true
    }
    closeStateUsersModal(){
      this.openUserModalValue = false
    }

    cancelApplicationForm(){
      let currentForm = {
        ...this.personalUserForm.value,
        ...this.polisForm.value,
        ...this.licensesForm.value,
        ...this.pasportForm.value,
      }
      const fd: FormData = new FormData();
      fd.append('data',  JSON.stringify(currentForm))
      this.loaderService.showLoading()
      this.eventService.toggleAplicationInRace(this.eventId, fd).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        })
      ).subscribe((res:any)=>{
          this.toastService.showToast('Заявка успешно отменена','success')
          this.getUsersInRace()
          this.getEvent()
      })
    }

   

    openApplicationForm(){
      if(this.authService.isAuthenticated()){
        this.applicationFormValueState = true
      }else{
        this.navController.navigateForward('/login')
      }
     
    }
    closeApplicationForm(){
      this.applicationFormValueState = false
    }

  getEvent(){
    this.loadingService.showLoading()
    this.eventService.getEventById(this.eventId,{
      userId:String(this.userService.user.value?.id ? this.userService.user.value?.id : '' ),
      appointmentUser:1,
    }).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.raceUser = res.race.user
      this.event = res.race
    })
  }

  checkUser(){
    if(this.userService.user.value){
      return this.userService.user.value?.id == this.raceUser.id
    }else{
      return false
    }
  }

  toggleAplicationInRace(){
    if(!this.invalidRequest()){
      let currentForm = {
        ...this.personalUserForm.value,
        ...this.polisForm.value,
        ...this.licensesForm.value,
        ...this.pasportForm.value,
      }
      const fd: FormData = new FormData();
      fd.append('data',  JSON.stringify(currentForm))
      this.loaderService.showLoading()
      this.eventService.toggleAplicationInRace(this.eventId, fd).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        })
      ).subscribe((res:any)=>{
          this.getUsersInRace()
          this.closeApplicationForm()
          this.toastService.showToast('Заявка успешно отправленна','success')
      })
    }
  }

  setUserInForm(){
    this.userService.refreshUser()
    if(this.userService.user.value?.personal){
      this.personalUserForm.patchValue(this.userService.user.value?.personal)
      this.personalUserForm.patchValue({
        dateOfBirth: this.userService.user.value?.personal.date_of_birth,
        phoneNumber: this.userService.user.value?.personal.phone_number,
        startNumber: this.userService.user.value?.personal.start_number,
        rankNumber: this.userService.user.value?.personal.rank_number,
        motoStamp:  this.userService.user.value?.personal.moto_stamp
      })
      console.log(this.personalUserForm.value)
    }else{
      this.personalUserForm.reset()
    }
  }
  setUserInDocuments(){
    this.userService.getUserDocuments().pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
    ).subscribe((res:any)=>{
      if(res.documents.length){
        this.licensesForm.patchValue((res.documents.find((doc:any)=> doc.type === 'licenses').data))
        this.polisForm.patchValue((res.documents.find((doc:any)=> doc.type === 'polis').data))
        this.pasportForm.patchValue((res.documents.find((doc:any)=> doc.type === 'pasport').data))
      }
    })
  }

  getUserDocuments(){
    this.userService.getUserDocuments().pipe().subscribe((res:any)=>{
      console.log(res)
    })
  }
  submitForm(){
  }

  getUsersInRace(){
    this.eventService.getUsersInRace(this.eventId).pipe().subscribe((res:any)=>{
      this.usersInRace = res.users
      console.log(res)
    })
  }

  invalidRequest(){
    if(this.personalUserForm.invalid || this.polisForm.invalid || this.pasportForm.invalid || this.licensesForm.invalid ){
      return true
    }else{
      return false
    }
  }

  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).pipe(
      finalize(()=>{
      })
    ).subscribe((params) => {
        this.eventId = params['id']
        this.getEvent()
        this.getUsersInRace()
        if(this.authService.isAuthenticated()){
          this.getUserDocuments()
          this.setUserInDocuments()
          this.setUserInForm()
        }
      })
    }

  ngOnInit() {}
}
