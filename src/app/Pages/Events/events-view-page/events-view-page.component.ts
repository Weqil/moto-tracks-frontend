import { Component, Inject, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, debounceTime, EMPTY, finalize,forkJoin, fromEvent, map, Observable, of, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
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
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import moment from 'moment';
import { ImagesModalComponent } from "../../../Shared/Components/UI/images-modal/images-modal.component";

import { formdataService } from 'src/app/Shared/Helpers/formdata.service';
import { SelectComandsComponent } from 'src/app/Shared/Components/Commands/select-comands/select-comands.component';
import { ICommand, ICommandCreate } from 'src/app/Shared/Data/Interfaces/command';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { CheckUserRoleService } from 'src/app/Shared/Data/Services/check-user-role.service';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CheckResultsPathPipe } from "../../../Shared/Helpers/check-results-path.pipe";

@Component({
  selector: 'app-events-view-page',
  templateUrl: './events-view-page.component.html',
  styleUrls: ['./events-view-page.component.scss'],
  imports: [SharedModule, SlidersModule, ButtonsModule, TrackSectionComponent, IonModal, HeaderModule, StandartInputComponent, UsersPreviewComponent,
    ConfirmModalComponent, CheckImgUrlPipe, FormsModule, StandartInputSelectComponent, RouterLink, ImagesModalComponent, SelectComandsComponent, PdfViewerModule, CheckResultsPathPipe]
})
export class EventsViewPageComponent  implements OnInit {

  constructor() { }
  
  private readonly destroy$ = new Subject<void>()

  route: ActivatedRoute = inject(ActivatedRoute)
  eventService: EventService = inject(EventService)
  authService: AuthService = inject(AuthService)
  resizeSubscription!: Subscription;
  navController: NavController = inject(NavController)
  loadingService: LoadingService = inject(LoadingService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  mapService:MapService = inject(MapService)

  comandSelectModalStateValue:boolean = false
  backgroundImages:string = ''
  changePersonalDateModalValue:boolean = false
  createRegionItems:any[] = []
  usersInRace:User[] = []
  event!:IEvent
  openUserModalValue:boolean = false
  currentResultFile:any = {
    path:'',
    zoomLevel:1
  }
  raceUser!:User
  checkUserRoleService:CheckUserRoleService = inject(CheckUserRoleService)
  searchRegionItems:any[] = []
  createCommandTemp!: ICommand
  licensesFile:any =''
  polisFile:any = ''
  notariusFile:any = ''
  confirmUsersRolesInGroupAplication:string[] = [userRoles.admin,userRoles.couch,userRoles.organization,userRoles.commission]

  licensesId:string = ''
  polisId:string = ''
  notariusId:string = ''
  resultModalState:boolean = false
  oldNotariusFile:any
  selectRegionInCommandModal:any = {}
  oldPolisFile:any
  selectRegionInCommandModalFunction(event:any){
    this.selectRegionInCommandModal = event
  }

  regionModalState:boolean = false

  ngZone: NgZone = inject(NgZone)
  documents:any = []

  usersPreviewConfig:{usersCount:number}={
    usersCount:0
  }
  
  formdataService:formdataService = inject(formdataService)
  commandService:ComandsService = inject(ComandsService)

  applicationFormValueState:boolean = false

  statusImagesModal?:boolean = false;
  formattedResultsDocument:[
    {
      path:string,
      zoomLevel:number
    }
  ]|any[] = []

  userService:UserService = inject(UserService)
  eventId: string = ''
  allComands:any[] = []
  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    commandId:new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    group:new FormControl('', [Validators.required]),
    rank:new FormControl('', [Validators.required]),
    gradeId:new FormControl('', [Validators.required]),
    rankNumber:new FormControl('', [Validators.required]),
    
    community:new FormControl('Лично', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    coach:new FormControl('', [Validators.required]),
    motoStamp:new FormControl('', [Validators.required]),
    engine:new FormControl('', [Validators.required]),
    numberAndSeria:new FormControl('', [Validators.required]),
    comment:new FormControl('', [Validators.required])
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
    {name:'Урал',value:'Урал'},
    {name:'Zabel', value:'Zabel'},
    {name:'MTX', value:'MTX'},
    {name:'TRIUMPH', value:'TRIUMPH'},
    {name:'Suzuki', value:'Suzuki'},
    {name:'Другое', value:'Другое'}
   ]
   groupItems: {name:string, value:string}[] = []

    licensesForm: FormGroup = new FormGroup(
      {
        number: new FormControl('',[Validators.required, ]), //номер лицензии
        licensesFileLink: new FormControl('',[Validators.required, ]), // путь до файла
      }
    )
  
    polisForm: FormGroup = new FormGroup(
      {
        number: new FormControl('',[Validators.required, ]), //Серия и номер полиса
        issuedWhom: new FormControl('',[Validators.required, ]), //Кем выдан
        itWorksDate: new FormControl('',[Validators.required, ]), //Срок действия
        polisFileLink: new FormControl('',[Validators.required, ]), // путь до файла
      }
    )
   
    


    formErrors:any = {
      name: {
        errorMessage:''
      },
      patronymic:{
         errorMessage:''
      },
      dateOfBirth:{
         errorMessage:''
      },
      inn:{
        errorMessage:''
      },
      snils:{
        errorMessage:''
      },
      phoneNumber:{
        errorMessage:''
      },
      startNumber:{
        errorMessage:''
      },
      group:{
        errorMessage:''
      },
      rank:{
        errorMessage:''
      },

      surname: {
         errorMessage:''
      },
      region: {
         errorMessage:''
      },
      city: {
         errorMessage:''
      },
      community:{
        errorMessage:''
      },
      motoStamp:{
        errorMessage:''
      },
      engine:{
        errorMessage:''
      },
      numberAndSeria:{
        errorMessage:''
      }
    }

    documentsError:any = {
      polisNumber:{
        errorMessage:''
      },
      issuedWhom:{
        errorMessage:''
      },
      itWorksDate:{
        errorMessage:''
      },
      polisFile:{
        errorMessage:''
      },

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

   setRegion(region:any){
    this.closeRegionModal()
    this.personalUserForm.patchValue({locationId:region.value, region:region.name})
   }

   getRegions(){
    this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
      this.searchRegionItems.push({name:`Россия`,value:''})
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }
  getAllComands(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    this.commandService.getComands().pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
  

      this.allComands = []
      this.allComands.push(
          {id: '', name: 'Лично', region: 'papilapup'}
      )
    
      if(this.createCommandTemp){
        this.allComands.push(...res.commands.filter((command:ICommand)=> command.id == this.createCommandTemp.id))
        this.allComands.push(...res.commands.filter((command:ICommand)=> command.id !== this.createCommandTemp.id))
      }else{

        this.allComands.push(...res.commands) 
      }
      
    
     
    })
  }

    formatingText(text:string): string{
        return text.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');;
    }

    checkRecordEnd(){
      let now = moment().format('YYYY-MM-DD HH:mm')
      // console.log(now > moment(this.event?.record_end) )
      return now > moment(this.event?.record_end).format('YYYY-MM-DD HH:mm')
    }

    checkDateStart(){
      let now = moment().format('YYYY-MM-DD HH:mm')
      return now > moment(this.event?.date_start).format('YYYY-MM-DD HH:mm')
    }

    checkRecordStart(){
      let now = moment().format('YYYY-MM-DD HH:mm')
      if(this.event?.record_start){
        return now < moment(this.event?.record_start).format('YYYY-MM-DD HH:mm')
      }else{
        return false
      }
     
    }

    setEngine(event:any){
      this.personalUserForm.patchValue({engine: event.name})
    }
    setGroup(event:any){
      this.personalUserForm.patchValue({group: event.name, gradeId:event.id})
  
    }
    
    setRank(event:any){
      this.personalUserForm.patchValue({rank: event.name})
    }
    clearRegionInComandFilter(){
      this.selectRegionInCommandModal = {}
    }
    setMotoStamp(event:any){
      this.personalUserForm.patchValue({motoStamp: event.name})
    }

    // cancelApplicationForm(){
 
    //   let currentForm = {
    //     ...this.personalUserForm.value, 
    //     licensesFileLink:``,
    //     polisFileLink:``,
    //     notariuFileLink:``,   
    //     documentIds:[this.polisId,this.licensesId,this.notariusId]   
    //   }
    //   const fd: FormData = new FormData();
    //   this.formdataService.formdataAppendJson(fd, currentForm)
    //   let loader:HTMLIonLoadingElement
    //   this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
    //     loader = res
    //   })
    //   this.eventService.toggleAplicationInRace(this.eventId, fd).pipe(
    //     finalize(()=>{
    //       this.loadingService.hideLoading(loader)
    //     })
    //   ).subscribe((res:any)=>{
    //       this.toastService.showToast('Заявка успешно отменена','success')
    //       this.getUsersInRace()
    //       this.getEvent()
    //   })
    // }

   redirectInRace(){
     this.navController.navigateForward(`/track/${this.event.track.id}`)
   }

   //Если у пользователя не было данных создаём их
   setFirstUserPersonal(){
    if(!this.userService.user.value?.personal){
        let loader:HTMLIonLoadingElement
        this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
          loader = res
        })
        this.userService.createPersonalInfo(this.personalUserForm.value).pipe(
          finalize(
            ()=>{
              this.loaderService.hideLoading(loader)
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
  formatingZoomValuesInResults(){
    this.formattedResultsDocument = []
    this.event.pdf_files.forEach((file:any)=>{
      this.formattedResultsDocument.push({
        path:file,
        zoomLevel:1,
      })
    })
  }

   clearDescription(){
    return this.sanitizer.bypassSecurityTrustHtml(this.formatingText(String(this.event.desc)))
   }

   createLicenses(): Observable<any> {
   
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
      let fd: FormData = new FormData();
      fd.append('type', 'licenses');
      fd = this.formdataService.formdataAppendJson(fd,this.licensesForm.value)

      fd.append('file', this.licensesFile);
      
      return this.userService.createUserDocument(fd).pipe(
        finalize(() => {
          this.loaderService.hideLoading(loader);
        }),
        catchError((err: serverError) => {
          this.toastService.showToast(err.error.message, 'danger');
          return EMPTY;
        })
      );
    
    return of(null);
  }

  createPolis(): Observable<any> {
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
      let fd: FormData = new FormData();
      fd.append('type', 'polis');
      fd = this.formdataService.formdataAppendJson(fd, this.polisForm.value);
      fd.append('file', this.polisFile);
      
      return this.userService.createUserDocument(fd).pipe(
        finalize(() => {
          this.loaderService.hideLoading(loader);
        }),
        catchError((err: serverError) => {
          this.toastService.showToast(err.error.message, 'danger');
          return EMPTY;
        })
      );
    
    return of(null);
  }

 createNotarius(): Observable<any>{
  let fd: FormData = new FormData()
   fd.append('type','notarius')
   fd.append('file',this.notariusFile)
    this.userService.createUserDocument(fd).pipe(
    finalize(()=>{

    })
    ).subscribe((res:any)=>{
    })
  
    return of(null);
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
      oldPersonal.commandId = oldPersonal.command.id
      delete oldPersonal['command']
      oldPersonal.locationId = oldPersonal.location.id
      delete oldPersonal['location']
      oldPersonal.gradeId = this.personalUserForm.value.gradeId
      oldPersonal.dateOfBirth = oldPersonal.date_of_birth;
      oldPersonal.comment = ''
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
      Object.keys(normalizedOld).map((key:string)=>{
       
        if(!normalizedForm[key]){
         
        }
      })
      //Если обьекты различаются
      if(!personalFormChange){
        this.changePersonalDateModalValue = true
      }
    }
    
  }

  redirectTrenerInEditAplication(){
    window.location.assign(`/aplication/${this.event.id}`);
  }

  checkDateStartInRace(){
    if(this.event){
      let now = moment().format()
      return moment(this.event.date_start).format() < now
    }else{
      return
    }
  }
  closeUploadResultModalState(){
    this.resultModalState = false
  }
  openUploadResultModalState(document:any){
    this.currentResultFile = document
    this.resultModalState = true
  }
  zoomIn(document:{path:string,zoomLevel:number}) {
    let currentDocument = this.formattedResultsDocument.find((documentInArray:{path:string,zoomLevel:number})=>documentInArray.path == document.path )
    currentDocument.zoomLevel += 0.1; // Увеличиваем масштаб на 10%
  }

  zoomOut(document:{path:string,zoomLevel:number}) {
    let currentDocument = this.formattedResultsDocument.find((documentInArray:{path:string,zoomLevel:number})=>documentInArray.path == document.path )
    currentDocument.zoomLevel -= 0.1; // Уменьшаем масштаб на 10%
  }

  resetZoom(document:{path:string,zoomLevel:number}) {
    let currentDocument = this.formattedResultsDocument.find((documentInArray:{path:string,zoomLevel:number})=>documentInArray.path == document.path )
    currentDocument.zoomLevel = 1.0; 
  }
  saveNewPersonal(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
          loader = res
    })

        // Форматируем номер телефона перед отправкой
        let rawPhone = this.personalUserForm.value.phoneNumber;
        let cleanedPhone = rawPhone.toString();
        this.personalUserForm.patchValue({ phoneNumber: cleanedPhone });

    this.userService.updatePersonalInfo(this.personalUserForm.value).pipe(
      finalize(
        ()=>{
          this.loaderService.hideLoading(loader)
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

  setComand(event:any){
    this.personalUserForm.patchValue({community:event.name})
    this.personalUserForm.patchValue({commandId:event.id})
    this.closeComandSelectModalStateValue()
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
  closeComandSelectModalStateValue(){
    this.comandSelectModalStateValue = false
  }
  openComandSelectModalStateValue(){
    this.comandSelectModalStateValue = true
  }

  //здесь лоадер???
  setFirstDocuments(): Observable<void> {
    return this.userService.getUserDocuments().pipe(
      finalize(() => {

      }),
      switchMap((res: any) => {
        
        let operations: Observable<any>[] = [];
        
        if (!res.documents.find((doc: any) => doc.type === 'licenses')) {
          operations.push(this.createLicenses());
        }
        if (!res.documents.find((doc: any) => doc.type === 'polis')) {
          operations.push(this.createPolis());
        }
        if (!res.documents.find((doc: any) => doc.type === 'notarius')) {
          operations.push(this.createNotarius());
        }
        
        return operations.length ? forkJoin(operations) : of(null);
      }),
      map(() => void 0)
    );
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

    closeRegionModal(){
      this.regionModalState = false
    }
    openRegionModal(){
      this.regionModalState = true
    }
  
    createNewComand(formData: { id:number; name: string; city: string; locationId: number; region: string}){
      
      const id = formData.id;
      const region = formData.region;
      const name = formData.name;
      const locationId = formData.locationId;
      const city = formData.city;

      if (!name || !city || !locationId) {
        this.toastService.showToast('Заполните все поля перед созданием команды', 'warning');
        return;
      }
  
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
       loader = res
      })


      let user: User|null = this.userService.user.value
      let commandValidateState: boolean = false
      let command: ICommandCreate = {
        id: id,
        name: name,
        locationId: locationId,
        city: city,
        region: region
      }
      if(user){
        // if(user.personal && user.personal.city && user.personal.location){
        //   command.locationId = Number(user.personal.location.id)
        //   command.city = user.personal.city
        // }
        // else if(this.personalUserForm.value.city && this.personalUserForm.value.locationId){
        //   command.locationId = Number( this.personalUserForm.value.locationId)
        //   command.city = this.personalUserForm.value.city
        // }
        // else{
        //   this.closeComandSelectModalStateValue()
        //   this.toastService.showToast('Перед тем как создать команду обязательно заполните область и город','warning')
        // }
        
        Object.keys(command).forEach((key:any)=>{
          commandValidateState =  !!command[key as keyof typeof command]
        })
        if(commandValidateState){
          let fd:FormData = new FormData()
          fd = this.formdataService.formdataAppendJson(fd, command)
          this.commandService.createComand(fd).pipe(
            finalize(()=>{
              this.loaderService.hideLoading(loader)
            })
          ).subscribe((res: any)=>{
    
            this.createCommandTemp = res.command
            this.getAllComands()
          })
        }
        
      }
    }

    //здесь лоадер
  getEvent(){
    let loader:HTMLIonLoadingElement
         this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
               loader = res
         })
    this.eventService.getEventById(this.eventId,{
      userId:String(this.userService.user.value?.id ? this.userService.user.value?.id : '' ),
      appointmentUser:1,
    }).pipe(
      catchError(err => {
        console.log('Кринж случился я прошел c ошибкой')
        console.log(err)
        // console.error('Ошибка при загрузке:', err);
        // this.errorMessage = 'Ошибка загрузки пользователей';
        return err; // или [] — в зависимости от ожидаемой структуры
      }),
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.raceUser = res.race.user
      this.event = res.race
      
      this.groupItems = this.event.grades
      console.log('e mae')
      console.log(this.groupItems)
      
      this.formatingZoomValuesInResults()
      this.checkRecordEnd()
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
    if(this.submitValidate()){
      await this.setFirstDocuments().pipe().subscribe(()=>{
        this.setDocuments().pipe().subscribe(()=>{
           // Форматируем номер телефона перед отправкой
        let rawPhone = this.personalUserForm.value.phoneNumber || '';
        let cleanedPhone = String(rawPhone).replace(/\D/g, '') || '';
     
        this.personalUserForm.patchValue({ phoneNumber: cleanedPhone });
         let currentForm = {
           ...this.personalUserForm.value,
           documentIds:[this.polisId, this.licensesId,this.notariusId]   
         }
         let fd: FormData = new FormData();
         fd = this.formdataService.formdataAppendJson(fd, currentForm)
     
         let loader:HTMLIonLoadingElement
         this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
               loader = res
         })
         this.eventService.toggleAplicationInRace(this.eventId, fd).pipe(
           finalize(()=>{
             this.loadingService.hideLoading(loader)
             
           }),
           catchError(err => {
            console.log('Кринж случился я прошел c ошибкой')
            console.log(err)
            // console.error('Ошибка при загрузке:', err);
            // this.errorMessage = 'Ошибка загрузки пользователей';
            return err; // или [] — в зависимости от ожидаемой структуры
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
        })
     })
    }else{
      this.toastService.showToast('Заполните обязательные поля - Фамилия, имя, область, класс, спортивное звание, телефон','danger')
    }
  }

  setUserInForm(){
    this.userService.refreshUser()
    if(this.userService.user.value?.personal){
      this.personalUserForm.patchValue(this.userService.user.value?.personal)

      const rawPhone = this.userService.user.value?.personal?.phone_number || '';
      const cleanedPhone = parseInt(rawPhone.replace(/\D/g, ''), 10) || 0; // Удаляем все символы, кроме цифр

      this.personalUserForm.patchValue({
        dateOfBirth: this.userService.user.value?.personal.date_of_birth,
        phoneNumber: cleanedPhone,
        startNumber: this.userService.user.value?.personal.start_number,
        locationId: this.userService.user.value?.personal.location?.id,
        commandId: this.userService.user.value?.personal.command?.id,
        region: this.userService.user.value?.personal.location ? this.userService.user.value?.personal.region : '',
        community: this.userService.user.value?.personal.command?.id ? this.userService.user.value?.personal.command?.name : '',
        rankNumber: this.userService.user.value?.personal.rank_number,
        motoStamp:  this.userService.user.value?.personal.moto_stamp,
        numberAndSeria: this.userService.user.value?.personal.number_and_seria,
        group:''
      })
    }else{
      this.personalUserForm.reset()
    }
  }

//здесь лоадер
  setDocuments(): Observable<any>{
    this.userService.getUserDocuments().pipe(
     finalize(()=>{
       
     })
     ).subscribe((res:any)=>{
     if(res.documents){
       if(res.documents.find((doc:any)=> doc.type === 'licenses')){
         let licensesDocument = res.documents.find((doc:any)=> doc.type === 'licenses')
         this.licensesId = licensesDocument.id
         this.licensesForm.patchValue(((res.documents.find((doc:any)=> doc.type === 'licenses'))))
         this.licensesFile = {name:'Лицензия загружена', path:  `${environment.BASE_URL}/document/${licensesDocument.id } ` }
       
       }
       if((res.documents.find((doc:any)=> doc.type === 'polis'))){
         let polisDocument = res.documents.find((doc:any)=> doc.type === 'polis')
         this.polisId = polisDocument.id
         this.polisForm.patchValue({
          number: polisDocument.number,
          issuedWhom: polisDocument.issued_whom,
          itWorksDate: moment(polisDocument.it_works_date).format('YYYY-MM-DD')
         })
         this.polisFile = {name:'Полис загружен', path:  `${environment.BASE_URL}/document/${polisDocument.id}`}
       }
       
       if(res.documents.find((doc:any)=> doc.type === 'notarius')){
         let notariusDocument = res.documents.find((doc:any)=> doc.type === 'notarius')
         this.notariusId = notariusDocument.id
         this.notariusFile = {name:'Согласие загружено', path: `${environment.BASE_URL}/document/${notariusDocument.id}`}
         this.oldNotariusFile = {name:'Согласие загружено',  path:  `${environment.BASE_URL}/document/${notariusDocument.id}`}
       } 
     }
    
   })
   return of(null);
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
      if(this.usersInRace){
        Object.keys(this.usersInRace).forEach((res:any)=>{
        let tempArray:any = Array(this.usersInRace[res])[0]
         this.usersPreviewConfig.usersCount += tempArray.length
        })
      }
      
    })
  }

  invalidRequest(){
    if(this.personalUserForm.invalid || this.polisForm.invalid || this.licensesForm.invalid ){
      return true
    }else{
      return false
    }
  }

  submitValidate(){
    let valid = true
    Object.keys(this.personalUserForm.controls).forEach((key) => {
      const control = this.personalUserForm.get(key); 
      if (!control!.valid) {
        if(this.formErrors[key]){
          this.formErrors[key].errorMessage = 'Обязательное поле'; 
           valid = false
        }
      } else {
          if( this.formErrors[key]){
            this.formErrors[key].errorMessage = ''; 
          }
      }
    });
    Object.keys(this.polisForm.controls).forEach((key) => {
      const control = this.polisForm.get(key);
      if (!control!.valid) {
        if(this.documentsError[key]){
          this.documentsError[key].errorMessage = 'Обязательное поле'; 
           valid = false
        }
      } else {
          if( this.documentsError[key]){
            this.documentsError[key].errorMessage = ''; 
          }
      }
    })

  

    return valid
  }

  closeImagesModal() {
    this.statusImagesModal = false
  }

  openImagesModalFunction() {
    this.statusImagesModal = true
  }
  onResize() {
    this.checkInImagesBackGround()
  }

  checkInImagesBackGround(){
    const width = window.innerWidth;
    if(width > 696){
      this.backgroundImages = '/assets/images/race-background__big.jpg'
    }else{
      this.backgroundImages = '/assets/images/race-background.jpg'
    }
  }


  

  getCreateRegions(){
    this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
    
      res.data.forEach((region:any) => {
        this.createRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }
  
  backNavigate(){
    this.navController.back()
  }

  ionViewWillEnter(){
    this.getRegions()
    this.getCreateRegions()
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
          this.getAllComands()
        }
      })
    }

  
  ngOnInit() {
    this.checkInImagesBackGround()
    //Необходимо что бы не ломалась модалка
    window.addEventListener('popstate', (event) => {
      this.closeStateUsersModal()
      this.closeApplicationForm()
      this.closeImagesModal()
      this.closeUploadResultModalState()
      this.closeRegionModal()
      this.closeComandSelectModalStateValue()
    });
    this.resizeSubscription = fromEvent(window, 'resize')
    .pipe(
      debounceTime(200) // Убирает лишние вызовы при частом ресайзе
    )
    .subscribe(() => {
      this.onResize();
    });
  }

  redirectApplicationForRace(){
    this.navController.navigateForward(`application-for-race/${this.event.id}`)
  }
}
