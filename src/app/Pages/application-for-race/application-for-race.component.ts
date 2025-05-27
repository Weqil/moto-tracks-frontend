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
import { UserInApplicationComponent } from "../../Shared/Components/UserElements/user-in-application/user-in-application.component";
import { Documents } from '@app/Shared/Data/Interfaces/document-models';
import { IconButtonComponent } from "../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";


@Component({
  selector: 'app-application-for-race',
  templateUrl: './application-for-race.component.html',
  styleUrls: ['./application-for-race.component.scss'],
  imports: [CommonModule, IonContent, HeaderModule, UserModule, UserViewPageComponent, UserInApplicationComponent, IconButtonComponent],
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

    getUsersInRace(){
      this.eventService.getUsersInRace(this.eventId).pipe().subscribe((res:any)=>{
        
        this.usersInRace = res.users
      
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

    
  

    navigateToUser(userId: string, userGet: User) {
     
      this.getDocumentUserById(Number(userId))
      this.userGetId = userId
      this.userGet= userGet
      
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
        

          // Только теперь открываем компонент
          this.viewUser = true
        })
    
      }

    createUserInAplication(aplication:any){
      let userInAplication:any = {
        name:aplication.name,
        rank:aplication.rank,
        surname:aplication.surname,
        city:aplication.city,
        avatar:aplication.user.avatar,
        start_number:aplication.start_number
      }
      return userInAplication
    }

    ngOnChanges(changes: SimpleChanges) {
      

    }

    
      
  
      
    

    

  ngOnInit() {
   
  }

}
