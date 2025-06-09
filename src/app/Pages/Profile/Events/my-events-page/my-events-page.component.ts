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
import { IconButtonComponent } from "../../../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import _ from 'lodash';
import { CheckUserRoleService } from '@app/Shared/Data/Services/check-user-role.service';
import { UserStatuses,translitUserStatuses } from 'src/app/Shared/Enums/user-status';
@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.scss'],
  imports: [SharedModule, HeaderModule, EventModule, IonModal, TabsComponent, TabsItemComponent, IconButtonComponent]
})
export class MyEventsPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  checkUserRoleService:CheckUserRoleService = inject(CheckUserRoleService)
  events!:any
  finishedEvents!:any
  tableModalValue:boolean = false
  regionFilterId:string = ''
  allFilter:boolean = true
  expiredFilter:boolean = false
  currentFilter:boolean = false
  userRider:boolean = false
  googleTabsLink:string = ''
  userService: UserService = inject(UserService)
  loadingService:LoadingService = inject(LoadingService)
  formatedEvents: { groupMonth: string, events: IEvent[] }[] = [];
  rgpFilter:boolean = false
   eventsFilter:any = {
    locationId:[this.regionFilterId], 
    sort:'asc',
    commissionUser:1,
    userId: String(this.userService.user.value?.id)
  }
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
    this.navController.navigateRoot(`/race/edit/${eventId}`,{ animationDirection: 'forward' })
  }

closetTableModal(){
  this.tableModalValue = false
}
  userHaveRoot(){
    return this.userService.user.value?.roles.find((role:any)=>role.name == userRoles.admin || role.name == userRoles.root) !== undefined
  }

  setRgpFilter(event:any){
    this.setFilterInTape('rgp')
    this.rgpFilter = event
  }

 setFilterInTape(filter:'all'|'current'|'expired'|'rgp'){
    this.allFilter = filter == 'all'
    this.currentFilter = filter == 'current'
    this.expiredFilter = filter == 'expired'
    this.rgpFilter = filter == 'rgp'

    if(this.currentFilter){
      this.eventsFilter =  {
        dateStart:moment().subtract(2,'days').format('YYYY-MM-DD'),
        locationId:[this.regionFilterId], 
        sortField:'date_start',
        sort:'asc',
        commissionUser:1,
        userId: String(this.userService.user.value?.id)
 
      }
    }
    if(this.expiredFilter){
      this.eventsFilter = {
        dateEnd:moment().subtract(2, 'days').locale('ru'). format('YYYY-MM-DD'), 
        locationId:[this.regionFilterId], sortField:'date_start',
         sort:'desc',commissionUser:1,
         userId: String(this.userService.user.value?.id)
      }
    }

    if(this.allFilter){
      this.eventsFilter =  {
        locationId:[this.regionFilterId], 
        sort:'asc',
        commissionUser:1,
        userId: String(this.userService.user.value?.id)
      }
    }

    if(this.rgpFilter){
      this.eventsFilter =  {
        dateStart:moment().subtract(2,'days').format('YYYY-MM-DD'),
        locationId:[this.regionFilterId], 
        sortField:'date_start',
        sort:'asc',
        commissionUser:1,
        userId: String(this.userService.user.value?.id)
      }
    }
    this.getEvents()

  }

   getEvents(){
      let loader:HTMLIonLoadingElement
      this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
          loader = res
      })
      if(this.userRider){
        delete this.eventsFilter['userId']
        this.eventsFilter.userIdExists = this.userRider ? String(this.userService.user.value?.id):''
      }
      this.eventService.getAllEvents({...this.eventsFilter,userOnlyAppointment:Number(this.userRider),} ).pipe(
        finalize(()=>{ 
          this.loadingService.hideLoading(loader)
        })).subscribe((res:any)=>{
          this.startEvents = res.races
          this.formatedEvents = Object.keys(_.groupBy(this.startEvents, (event:any) => moment(event.date_start).locale('ru').format('MMMM YYYY')))
        .map(groupMonth => ({
          groupMonth: groupMonth.charAt(0).toUpperCase() + groupMonth.slice(1),
          events: _.groupBy(this.startEvents, (event:any) => moment(event.date_start).locale('ru').format('MMMM YYYY'))[groupMonth]
        }));
      })
  
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

  closeModalAlert(){
    this.tableModalValue = false
    
  }

  back(){
    this.navController.back()
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
    this.userRider = this.checkUserRoleService.searchLastRole()?.name == UserStatuses.rider

    this.setFilterInTape('all')
    this.getEvents()
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
