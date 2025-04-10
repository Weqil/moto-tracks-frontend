import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '@app/Shared/Components/UI/header/header.component';
import { NoDataFoundComponent } from '@app/Shared/Components/UI/no-data-found/no-data-found.component';
import { UserSectionComponent } from '@app/Shared/Components/UserElements/user-section/user-section.component';
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { EventService } from '@app/Shared/Data/Services/Event/event.service';
import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { IonContent } from "@ionic/angular/standalone";
import { isArray } from 'lodash';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-confirm-aplication',
  templateUrl: './confirm-aplication.component.html',
  styleUrls: ['./confirm-aplication.component.scss'],
  imports:[
    IonContent,
    HeaderComponent,
    UserSectionComponent,
    CommonModule,
    NoDataFoundComponent
  ]
})
export class ConfirmAplicationComponent  implements OnInit {

  constructor() { }
  
  
  router:ActivatedRoute = inject(ActivatedRoute)

  loadingService:LoadingService = inject(LoadingService)

  eventService:EventService = inject(EventService)

  eventId:string = ''

  users:User[] = []
  formattedUsers: {group:any,users:User[]}[] = []

  ngOnInit() {}

  createUserInAplication(aplication:any){

    aplication = isArray(aplication)? aplication[0] : aplication

    let userInAplication:any = {
      name:aplication.name,
      rank:aplication.rank,
      surname:aplication.surname,
      city:aplication.city,
      avatar:aplication.user.avatar
    }
   
    return userInAplication
  }

  ionViewWillEnter(){
    this.eventId = this.router.snapshot.params['id']
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })

    this.eventService.getUsersInRace(String(this.eventId)).pipe(
      finalize(()=>this.loadingService.hideLoading(loader))
    ).subscribe((res:any)=>{
      this.users = res.users
      Object.keys(this.users).forEach((res: any) => {
        this.formattedUsers.push({ group: res, users:[this.users[res]]});
      })
    })


  }

}
