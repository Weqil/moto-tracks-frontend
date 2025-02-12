import { Component, Inject, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, Subject, takeUntil, tap } from 'rxjs';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackSectionComponent } from "../../../Shared/Components/Track/track-section/track-section.component";
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { IonModal, NavController, Platform } from '@ionic/angular/standalone';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { AuthService } from 'src/app/Shared/Data/Services/Auth/auth.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';

import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import * as _ from 'lodash';

import { UsersPreviewComponent } from 'src/app/Shared/Components/UI/users-preview/users-preview.component';
import { ConfirmModalComponent } from 'src/app/Shared/Components/UI/confirm-modal/confirm-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';
import { environment } from 'src/environments/environment';
import { group } from '@angular/animations';

@Component({
  selector: 'app-events-view-page',
  templateUrl: './events-view-page.component.html',
  styleUrls: ['./events-view-page.component.scss'],
  imports: [SharedModule, SlidersModule, ButtonsModule, TrackSectionComponent, IonModal, HeaderModule, StandartInputComponent, UsersPreviewComponent, 
    ConfirmModalComponent, CheckImgUrlPipe,FormsModule, StandartInputSelectComponent,RouterLink]
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
  changePersonalDateModalValue:boolean = false
  usersInRace:User[] = []
  event!:IEvent
  openUserModalValue:boolean = false
  raceUser!:User

  licensesFile:any =''
  polisFile:any = ''
  notariusFile:any = ''

  oldNotariusFile:any

  oldPolisFile:any

  ngZone: NgZone = inject(NgZone)
  documents:any = []
  
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
    numberAndSeria:new FormControl('', [Validators.required]),
  })

  engineItems:{name:string, value:string}[] = [
    {name:'2Т', value:'2Т'},
    {name:'4Т', value:'4Т'},
  ]

  sportRankItems:{name:string, value:string}[] = [
    {name:'МСМК', value:'МСМК'},
    {name:'МС', value:'МС'},
    {name:'КМС', value:'КМС'},
    {name:'I', value:'I'},
    {name:'II', value:'II'},
    {name:'III', value:'III'},
    {name:'Iю', value:'Iю'},
    {name:'IIю', value:'IIю'},
    {name:'IIIю', value:'IIIю'},
    {name:'б/р', value:'б/р'},
  ]

  motoStampItems: {name:string, value:string}[] = [
    {name:'Kaw', value:'Kaw'},
    {name:'KTM', value:'KTM'},
    {name:'Yam', value:'Yam'},
    {name:'Gas-Gas', value:'Gas-Gas'},
    {name:'Hon', value:'Hon'},
    {name:'BSE', value:'BSE'},
    {name:'Husq', value:'Husq'},
    {name:'Kayo', value:'Kayo'},
    {name:'Fantic', value:'Fantic'},
   ]
   groupItems: {name:string, value:string}[] = [
    {name:'Тренер', value:'Тренер'},
    {name:'Стажер', value:'Стажер'},
    {name:'Контролер', value:'Контролер'},
    {name:'Мастер', value:'Мастер'},
    {name:'Менеджер', value:'Менеджер'},
    {name:'Старший менеджер', value:'Старший менеджер'},
    {name:'Специалист', value:'Специалист'},
    {name:'Мастер-контролер', value:'Мастер-контролер'},
    {name:'Менеджер-контролер', value:'Менеджер-контролер'},
   ]

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

    formErrors:any = {
      name: {
        errorMessage:''

      },
      surname: {
         errorMessage:''
      },
      city: {
         errorMessage:''
      },
      startNumber: {
         errorMessage:''
      },
      group:{
         errorMessage:''
      }
  }

    loaderService:LoadingService = inject(LoadingService)
    platform:Platform = inject(Platform)
    pasport:any
    sanitizer:DomSanitizer = inject(DomSanitizer)
    licenses:any
    polis:any
    toastService:ToastService = inject(ToastService)

    openStateUsersModal(){
      this.openUserModalValue = true
    }
    closeStateUsersModal(){
      this.openUserModalValue = false
    }

   showToastInfoFileUpload(){
     this.toastService.showToast('Файл уже был загружен, измените его в анкете участника','primary')
 
   }

    formatingText(text:string): string{
      return text.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');;
    }

    setEngine(event:any){
      this.personalUserForm.patchValue({engine: event.name})
    }
    setGroup(event:any){
      this.personalUserForm.patchValue({group: event.name})
    }
    
    setRank(event:any){
      this.personalUserForm.patchValue({rank: event.name})
    }

    setMotoStamp(event:any){
      this.personalUserForm.patchValue({motoStamp: event.name})
    }

    cancelApplicationForm(){
      let currentForm = {
        ...this.personalUserForm.value,
        ...this.polisForm.value,
        ...this.licensesForm.value,
        ...this.pasportForm.value,
        licensesFileLink:``,
        polisFileLink:``,
        notariuFileLink:``,   
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

   redirectInRace(){
     this.navController.navigateForward(`/track/${this.event.track.id}`)
   }

   //Если у пользователя не было данных создаём их
   setFirstUserPersonal(){
    if(!this.userService.user.value?.personal){
      this.loaderService.showLoading()
        this.userService.createPersonalInfo(this.personalUserForm.value).pipe(
          finalize(
            ()=>{
              this.loaderService.hideLoading()
            })
        ).subscribe((res:any)=>{
          this.userService.refreshUser()
        })
      }
   }

   setPolisFile(event:any){
    let file = event.target.files[0]
    this.polisFile = file
  }

   clearDescription(){
    return this.sanitizer.bypassSecurityTrustHtml(this.formatingText(String(this.event.desc)))
   }

  createLicenses(){
    if(this.licensesFile){
      this.loaderService.showLoading()
      let fd:FormData = new FormData()
      fd.append('type','licenses')
      fd.append('data',JSON.stringify(this.licensesForm.value))
      fd.append('file',this.licensesFile)
      this.userService.createUserDocument(fd).pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      }),
      catchError((err:serverError)=>{
        this.toastService.showToast(err.error.message,'danger')
        return EMPTY
      })
      ).subscribe((res:any)=>{
      })
    }
   }


  createPolis(){
    if(this.polisFile){
      let fd: FormData = new FormData()
      fd.append('type','polis')
      fd.append('data',JSON.stringify(this.polisForm.value))
      fd.append('file',this.polisFile)
       this.userService.createUserDocument(fd).pipe(
       finalize(()=>{
         this.loaderService.hideLoading()
       })
     ).subscribe((res:any)=>{
     })
    }
   
 }

 createNotarius(){
  if(this.notariusFile){
  let fd: FormData = new FormData()
   fd.append('type','notarius')
   fd.append('data',JSON.stringify({}))
   fd.append('file',this.notariusFile)
    this.userService.createUserDocument(fd).pipe(
    finalize(()=>{
      this.loaderService.hideLoading()
    })
    ).subscribe((res:any)=>{
    })
  }
   
 }

  //Проверяю изменились ли данные у пользователя
  checkChangeInPersonalform(){
    let personalFormChange = false
    function normalizeObject(obj: any) {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        acc[key] = obj[key] === null ? undefined : obj[key]; 
        return acc;
      }, {});
    }
    
    if (this.userService.user.value?.personal) {
      let oldPersonal: any = { ...this.userService.user.value.personal };
    
      // Переименовываем поля
      oldPersonal.dateOfBirth = oldPersonal.date_of_birth;
      oldPersonal.phoneNumber = oldPersonal.phone_number;
      oldPersonal.startNumber = oldPersonal.start_number;
      oldPersonal.rankNumber = oldPersonal.rank_number;
      oldPersonal.group = ''
      this.personalUserForm.patchValue({
        group:''
      })
      oldPersonal.motoStamp = oldPersonal.moto_stamp;
      oldPersonal.numberAndSeria = oldPersonal.number_and_seria
      // Удаляем старые названия
      delete oldPersonal.date_of_birth;
      delete oldPersonal.phone_number;
      delete oldPersonal.start_number;
      delete oldPersonal.rank_number;
      delete oldPersonal.moto_stamp;
      delete oldPersonal.number_and_seria
      // Приводим объекты к единому виду
      const normalizedOld = normalizeObject(oldPersonal);
      const normalizedForm = normalizeObject(this.personalUserForm.value);
    
      this.personalUserForm.patchValue({
        group:""
      })

      // Используем Lodash
      personalFormChange = _.isEqual(normalizedOld, normalizedForm);

      console.log()
      //Если обьекты различаются
      if(!personalFormChange){
        this.changePersonalDateModalValue = true
      }
    }
    
  }

  saveNewPersonal(){
    this.loaderService.showLoading()
    this.userService.updatePersonalInfo(this.personalUserForm.value).pipe(
      finalize(
        ()=>{
          this.loaderService.hideLoading()
        }
      )
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные успешно изменены', 'success')
      this.userService.refreshUser()
      this.getUsersInRace()
      this.changePersonalDateModalValue = false
    })
  }

  closePersonalNewModal(){
    this.changePersonalDateModalValue = false
  }

  openRacer(user:User){
    this.closeStateUsersModal()
    setTimeout(()=>{
      if(this.openUserModalValue == false){
        this.ngZone.run(() => {
          this.navController.navigateForward('/racer/1');
        });
      }
    },0)
 
  }
  checkChangeDocumentsForm(){

  }

   setFirstDocuments() {
    this.userService.getUserDocuments().pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      }),
      ).subscribe((res:any)=>{
        console.log(res.documents)
        let licensesDocument = res.documents.find((doc:any)=> doc.type === 'licenses')
        let polisDocument = res.documents.find((doc:any)=> doc.type === 'polis')
        let notariusDocument = res.documents.find((doc:any)=> doc.type === 'notarius')
        if(!licensesDocument){
          this.createLicenses()
        }
        if(!polisDocument){
          this.createPolis()
        }
        if(!notariusDocument){
          this.createNotarius()
        }
      })
   }

    openApplicationForm(){
      let isLoggedIn:boolean = this.authService.isAuthenticated()
      if(this.authService.isAuthenticated() && this.userService.user.value?.roles.length){
        this.applicationFormValueState = true
      }else if(this.authService.isAuthenticated() && !this.userService.user.value?.roles.length){
        this.toastService.showToast('Что бы отправить заявку измените статус','warning')
        this.navController.navigateForward('/settings')
      } else{
        this.toastService.showToast('Что бы отправить заявку авторизируйтесь','warning')
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


  async toggleAplicationInRace(){
    await this.setFirstDocuments()
    await this.setDocuments()
    if(this.submitValidate()){
      let currentForm = {
        ...this.personalUserForm.value,
        ...this.polisForm.value,
        ...this.licensesForm.value,
        ...this.pasportForm.value,
        licensesFileLink: this.licensesFile.path,
        polisFileLink: this.polisFile.path,
        notariusFileLink: this.notariusFile.path,
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
          this.getEvent()
          //Если пользователь не имел персональных данных
          this.setFirstUserPersonal()
      
          this.checkChangeInPersonalform()
          this.toastService.showToast('Заявка успешно отправленна','success')
      })
    }else{
    
      this.toastService.showToast('Заполните обязательные поля - Фамилия, имя, адрес, спортивное звание','danger')
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
        motoStamp:  this.userService.user.value?.personal.moto_stamp,
        numberAndSeria: this.userService.user.value?.personal.number_and_seria,
        group:''
      })
    }else{
      this.personalUserForm.reset()
    }
  }


  setDocuments(){
    return this.userService.getUserDocuments().pipe(
      finalize(()=>{
        this.loaderService.hideLoading()
      })
      ).subscribe((res:any)=>{
      if(res.documents){
        if(res.documents.find((doc:any)=> doc.type === 'licenses')?.data){
          let licensesDocument = res.documents.find((doc:any)=> doc.type === 'licenses')
          this.licensesForm.patchValue(JSON.parse((res.documents.find((doc:any)=> doc.type === 'licenses')?.data)))
          this.licensesFile = {name:'Лицензия загружена', path:  `${environment.BASE_URL}` + '/document/'+ licensesDocument.id } 
        }
        if((res.documents.find((doc:any)=> doc.type === 'polis')?.data)){
          let polisDocument = res.documents.find((doc:any)=> doc.type === 'polis')
          this.polisForm.patchValue(JSON.parse((res.documents.find((doc:any)=> doc.type === 'polis')?.data)))
          this.polisFile = {name:'Полис загружен', path:  `${environment.BASE_URL}` + '/document/' + polisDocument.id}
        }
        if(res.documents.find((doc:any)=> doc.type === 'pasport')?.data){
          this.pasportForm.patchValue(JSON.parse(res.documents.find((doc:any)=> doc.type === 'pasport')?.data))
        } 
        if(res.documents.find((doc:any)=> doc.type === 'notarius')?.path){
          let notariusDocument = res.documents.find((doc:any)=> doc.type === 'notarius')
          this.notariusFile = {name:'Согласие загружено', path: `${environment.BASE_URL}` + '/document/' + notariusDocument.id}
          this.oldNotariusFile = {name:'Согласие загружено',  path:  `${environment.BASE_URL}` + '/document/'+ notariusDocument.id}
        } 
      }
     
    })
  }

  setFormValue(){
    this.setDocuments()
  }

  setLicensesFile(event:any){
    let file = event.target.files[0]
    this.licensesFile = file
  }

  setNotariusFile(event:any){
    let file = event.target.files[0]
    this.notariusFile = file
  }

  getUsersInRace(){
    this.eventService.getUsersInRace(this.eventId).pipe().subscribe((res:any)=>{
      this.usersInRace = res.users
    })
  }

  invalidRequest(){
    if(this.personalUserForm.invalid || this.polisForm.invalid || this.pasportForm.invalid || this.licensesForm.invalid ){
      return true
    }else{
      return false
    }
  }

  submitValidate(){
    let valid = true
    Object.keys(this.personalUserForm.controls).forEach((key) => {
      const control = this.personalUserForm.get(key); // Доступ к контролу
      if (!control!.valid) {
        if(this.formErrors[key]){
          this.formErrors[key].errorMessage = 'Обязательное поле'; 
           valid = false
        }
      } else {
          if( this.formErrors[key]){
            this.formErrors[key].errorMessage = ''; // Очистка сообщения об ошибке
          }
      }
    });
    console.log(this.formErrors)
    return valid
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
          this.setFormValue()
          this.setUserInForm()
        }
      })
    }

    
  ngOnInit() {
    //Необходимо что бы не ломалась модалка
    window.addEventListener('popstate', (event) => {
      this.closeStateUsersModal()
    });
  }
}
