import { Component, inject, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent } from '@app/Shared/Data/Interfaces/event';
import { AuthService } from '@app/Shared/Data/Services/Auth/auth.service';
import { EventService } from '@app/Shared/Data/Services/Event/event.service';
import { UserService } from '@app/Shared/Data/Services/User/user.service';

import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { HeaderModule } from "../../Shared/Modules/header/header.module";
import { IonModal, NavController, Platform, IonContent } from '@ionic/angular/standalone';
import { isNull } from 'lodash';
import { UserModule } from "../../Shared/Modules/user/user.module";
import { CommonModule } from '@angular/common';
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { UserViewPageComponent } from "../Users/user-view-page/user-view-page.component";
import { Documents } from '@app/Shared/Data/Interfaces/document-models';
import { IconButtonComponent } from "../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StandartInputComponent } from "../../Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component";
import { StandartInputSelectComponent } from "../../Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component";
import { StandartRichInputComponent } from "../../Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component";
import { RegionsSelectModalComponent } from "../../Shared/Components/Modals/regions-select-modal/regions-select-modal.component";
import moment from 'moment';
import { CheckBoxComponent } from "../../Shared/Components/UI/LinarikUI/forms/check-box/check-box.component";


@Component({
  selector: 'app-application-for-race',
  templateUrl: './application-for-race.component.html',
  styleUrls: ['./application-for-race.component.scss'],
  imports: [CommonModule, IonContent, HeaderModule, UserModule, UserViewPageComponent, IconButtonComponent, StandartInputComponent, StandartInputSelectComponent, StandartRichInputComponent, RegionsSelectModalComponent, CheckBoxComponent],
})
export class ApplicationForRaceComponent  implements OnInit {

  

  route: ActivatedRoute = inject(ActivatedRoute)
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  private readonly destroy$ = new Subject<void>()
  loadingService: LoadingService = inject(LoadingService)
  userService:UserService = inject(UserService)
  loaderService:LoadingService = inject(LoadingService)
  authService: AuthService = inject(AuthService)
  activeAppId:any
  constructor(private router: Router) {}
  raceUser!:User
  eventId: string = ''
  event!:IEvent
  groupItems: {name:string, value:string}[] = []
  usersInRace:any = []
  usersPreview: any[] = []
  groups:any = []
  sortUsers: any = {}
  viewUser: boolean = false
  userGetId!: string
  userGet!:User
  arrayDocument:Documents[]=[]
  licensed:any
  notarius:any
  polish:any
  activeUserId:any
  licensesFile:any =''
  polisFile:any = ''
  notariusFile:any = ''
  userInfo:boolean = false
  raceInfo:boolean = false
  docInfo:boolean = false
  licensedInfo:boolean = false
  polishInfo:boolean = false
  notariusInfo:boolean = false

  usersPreviewConfig:{usersCount:number}={
    usersCount:0
  }
  users: any
  formattedUsers: {group:any,users:User[]}[] = []

  ionViewWillEnter(){

    
    
    this.route.params.pipe(takeUntil(this.destroy$)).pipe(
      finalize(()=>{
})
    ).subscribe((params) => {
        this.eventId = params['id']
        this.getEvent()
        this.getUsersInRace()
        
    
      })
    }

    getEvent(){
      let loader:HTMLIonLoadingElement
           this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
                 loader = res
           })
      this.eventService.getEventById(this.eventId,{
        userId:String(this.userService.user.value?.id ? this.userService.user.value?.id : '' ),
        appointmentUser:1,
      }).pipe(
        finalize(()=>{
          this.loadingService.hideLoading(loader)
        })
      ).subscribe((res:any)=>{
        this.raceUser = res.race.user
        this.event = res.race
        this.groupItems = this.event.grades
      })
    }

    back(){
      this.navController.back()
    }

    getUsersInRace(){
      this.eventService.getUsersInRace(this.eventId).pipe().subscribe((res:any)=>{
        
        this.usersInRace = res.users
        console.log(this.usersInRace)
        this.formattedUsers = [];

        Object.keys(this.usersInRace).forEach((key: string) => {
          this.formattedUsers.push({
            group: key,
            users: this.usersInRace[key]
          });
        });       

        if(this.usersInRace){
          Object.keys(this.usersInRace).forEach((res:any)=>{
          let tempArray:any = Array(this.usersInRace[res])[0]
           this.usersPreviewConfig.usersCount += tempArray.length
           
          })
        }

        
        
      })
     
    }

    
    licensesForm: FormGroup = new FormGroup(
    {
      number: new FormControl('',[Validators.required, Validators.minLength(1), ]), //номер лицензии
    }
  )

  polisForm: FormGroup = new FormGroup(
    {
      number: new FormControl('',[Validators.required]), //Серия и номер полиса
      issuedWhom: new FormControl('',[Validators.required]), //Кем выдан
      itWorksDate: new FormControl('',[Validators.required]), //Срок действия
    }
  )

  notariusForm:FormGroup = new FormGroup (
    {
      notariusFile: new FormControl('',[Validators.required,]), // путь до файла
    }
  )

    navigateToUser(userId: string, userGet: User, appId:any) {
      console.log('Типа передaл id:' )
      console.log(userId)
      this.getDocumentUserById(Number(userId))
      this.userGetId = userId
      this.userGet= userGet
      this.setUserInForm()
      this.activeUserId = userId
      this.activeAppId = appId
    }

    getDocumentUserById(userId:number){
      let loader:HTMLIonLoadingElement
      this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
          loader = res
      })

        this.userService.getUserDocumentsForUserId(userId).pipe(
          finalize(()=>{
            this.loadingService.hideLoading(loader)
          })
        ).subscribe((res:any)=>{
          this.arrayDocument = res.documents 
          console.log('Загрузил документы:', this.arrayDocument)

          if(res.documents.find((doc:any)=> doc.type === 'licenses')){
            let licensesDocument = res.documents.find((doc:any)=> doc.type === 'licenses')
            this.licensesForm.patchValue((res.documents.find((doc:any)=> doc.type === 'licenses')))
            this.licensesFile = {name:'Лицензия загружена', dontFile:true} 
            this.licensed = licensesDocument
            console.log(this.licensed)
          }
          if((res.documents.find((doc:any)=> doc.type === 'polis'))){
            let polis = (res.documents.find((doc:any)=> doc.type === 'polis'))
            this.polisForm.patchValue({
              number: polis.number,
              issuedWhom: polis.issued_whom,
              itWorksDate: polis.it_works_date
            })
            this.polisFile = {name:'Полис загружен', dontFile:true}
            this.polish = polis
            console.log(this.polish)
          }
          if(res.documents.find((doc:any)=> doc.type === 'notarius')){
            let notarius = (res.documents.find((doc:any)=> doc.type === 'notarius'))
            this.notariusFile = {name:'Согласие загружено', dontFile:true}
            this.notarius = notarius
            console.log(this.notarius)
          } 
          // Только теперь открываем компонент
          this.viewUser = true
        })
    
      }



    ngOnChanges(changes: SimpleChanges) {
      

    }

    
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
      grade:new FormControl('', [Validators.required]),
      rankNumber:new FormControl('', [Validators.required]),
      email:new FormControl('', [Validators.required]),
      community:new FormControl('', [Validators.required]),
      locationId: new FormControl('', [Validators.required]),
      coach:new FormControl('', [Validators.required]),
      motoStamp:new FormControl('', [Validators.required]),
      engine:new FormControl('', [Validators.required]),
      numberAndSeria:new FormControl('', [Validators.required]),
      comment:new FormControl('', [Validators.required])
    })
  
  

  
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
      },
      email:{
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
  
    setUserInForm(){
     
      if(this.userGet){
        this.personalUserForm.patchValue(this.userGet)
  
        const rawPhone = this.userGet?.phone_number || '';
        const cleanedPhone = parseInt(rawPhone.replace(/\D/g, ''), 10) || ''; // Удаляем все символы, кроме цифр
  
        this.personalUserForm.patchValue({
          name:this.userGet?.name,
          surname:this.userGet?.surname,
          dateOfBirth: this.userGet?.date_of_birth,
          phoneNumber: cleanedPhone,
          email:this.userGet?.user.email,
          startNumber: this.userGet?.start_number,
          locationId: this.userGet?.location?.id,
          commandId: this.userGet?.community, 
          region: this.userGet?.location.name + ' ' + this.userGet?.location.type,
          community: this.userGet?.community,
          rank: this.userGet?.rank,
          engine:this.userGet?.engine,
          motoStamp:  this.userGet?.moto_stamp,
          numberAndSeria: this.userGet?.number_and_seria,
          grade: this.userGet?.grade?.name,
          group:'',
          comment: this.userGet?.comment
        })
      }else{
        this.personalUserForm.reset()
      }
  
      console.log(this.personalUserForm.value)
    }
  
    checkBoxArray:any = [
      {
        value:1,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },     
      {
        value:2,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },
      {
        value:3,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },
      {
        value:4,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },
      {
        value:5,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },
      {
        value:6,
        state:false,
        labelText:'',
        theme:'white',
        clippy:''
      },
  
    ]
    

    CheckBoxValue(value:boolean){
      this.userInfo = !value
    }

    agreedApp(id: any){
      const comment = this.personalUserForm.get('comment')?.value;
      this.eventService.checkApplication(id, true, comment)
      .pipe(finalize(()=>{
        console.log('Запрос завершился')
      })).subscribe((res:any)=>
        {

          this.getUsersInRace()
          console.log('Запрос завершился успешно')
          
          }
        )
        

    }

    disagreedApp(id: any){
      const comment = this.personalUserForm.get('comment')?.value;
      this.eventService.checkApplication(id, false, comment)
      .pipe(finalize(()=>{
        console.log('Запрос завершился')
      })).subscribe((res:any)=>
        {

          this.getUsersInRace()
          console.log('Запрос завершился успешно')
          
          }
        )
        

    }

  ngOnInit() {
   
  }

}
