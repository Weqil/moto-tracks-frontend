import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { TabsComponent } from "../../../../Shared/Components/UI/tabs/tabs.component";
import { TabsItemComponent } from "../../../../Shared/Components/UI/tabs-item/tabs-item.component";
import moment from 'moment';
@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.scss'],
  imports: [SharedModule, HeaderModule, EventModule, IonModal, TabsComponent, TabsItemComponent]
})
export class MyEventsPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  events!:any
  finishedEvents!:any
  tableModalValue:boolean = false
  googleTabsLink:string = ''
  userService: UserService = inject(UserService)
  loadingService:LoadingService = inject(LoadingService)

  redirectInCreate(){
    this.navController.navigateRoot('/create-event')
  }
  
  generateGoogleLink(eventId:any){
    this.loadingService.showLoading()
    this.eventService.generateGoogleLink(eventId).pipe(
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.tableModalValue = true
      this.googleTabsLink = res.table_url
    })
  }

  redirectInEditPage(eventId:any){
    this.navController.navigateForward(`/race/edit/${eventId}`,{ animationDirection: 'forward' })
  }

closetTableModal(){
  this.tableModalValue = false
}
  userHaveRoot(){
    return this.userService.user.value?.roles.find((role:any)=>role.name == userRoles.admin || role.name == userRoles.root) !== undefined
  }

  startEvents(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })
    this.eventService.getAllEvents({userId: String(this.userService.user.value?.id), dateStart:moment().subtract(7,'days').format('YYYY-MM-DD'), sortField:'date_start', sort:'asc'}).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.events = res.races
    })
  }



  finishEvents(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })
    this.eventService.getAllEvents({userId: String(this.userService.user.value?.id),dateEnd:moment().subtract(7, 'days').locale('ru'). format('YYYY-MM-DD'), sortField:'date_start', sort:'asc'}).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.finishedEvents = res.races
    })
  }

  ionViewWillEnter(){
    this.startEvents()
    this.finishEvents()
  }

  ionViewDidLeave(){
   
  }

  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closetTableModal()
      
  })
  }

}
