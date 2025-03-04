import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { EventTapeService } from 'src/app/Shared/Data/Services/Event/event-tape.service';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { TabsComponent } from "../../../Shared/Components/UI/tabs/tabs.component";
import { TabsItemComponent } from "../../../Shared/Components/UI/tabs-item/tabs-item.component";

import moment from 'moment';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';


@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule, CommonModule, HeaderModule, EventModule, IonModal, TabsComponent, TabsItemComponent,StandartInputSearchComponent]
})
export class EventsTapePageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  loadingService:LoadingService = inject(LoadingService)
  eventTapeService: EventTapeService = inject(EventTapeService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  regionModalState:boolean = false
  userService: UserService = inject(UserService)
  tableModalValue:boolean = false
  googleTabsLink:string = ''

  searchRegionItems:any[] = []

  regionFilterName:string = 'Россия'
  regionFilterId:string = ''
  expiredEvents:IEvent[]=[]
  mapService:MapService = inject(MapService)
 
  redirectInTracks(){
    this.navController.navigateForward('/tracks')
  }

  closetTableModal(){
    this.tableModalValue = false
  }

 

  getRegions(){
    this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
      this.searchRegionItems.push({
        name:'Россия',
        value:''
      })
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }

  setRegion(event:any){

  }
  generateGoogleLink(eventId:any){
    this.loadingService.showLoading()
    this.eventService.generateGoogleLink(eventId).pipe(
      finalize(()=>
         this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.tableModalValue = true
      this.googleTabsLink = res.table_url
    })
  }

  openRegionModal(){
    this.regionModalState = true
  }
  closeRegionModal(){
    this.regionModalState = false
  }

  filterEventsInLocation(event:any){
    this.regionFilterName = event.name
    this.regionFilterId = event.value
    this.closeRegionModal()
    this.getExpiredEvents()
    this.getStartEvents()
  }

  getExpiredEvents(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })

    this.eventService.getAllEvents({dateEnd:moment().subtract(1,'days').format('YYYY-MM-DD'), locationId:[this.regionFilterId]}
  ).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.expiredEvents = res.races
    })

  }

  getStartEvents(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })

    this.eventService.getAllEvents({dateStart:moment().format('YYYY-MM-DD'),locationId:[this.regionFilterId]}).pipe(
      finalize(()=>{ 
        this.loadingService.hideLoading(loader)
      })).subscribe((res:any)=>{
        this.eventTapeService.events = res.races
    })

  }

  ionViewWillEnter(){

    this.getStartEvents()
    this.getExpiredEvents()
    this.switchTypeService.setTypeInLocalSorage('events')
    // this.eventService.getAllEvents({dateStart:moment().format('YYYY-MM-DD')}).pipe(
    //   finalize(()=> this.loadingService.hideLoading())
    // ).subscribe((res:any) => {
    //     this.eventTapeService.events = res.races
    // })
  }
 
  ngOnInit() {
    this.getRegions()
    window.addEventListener('popstate', (event) => {
      this.closetTableModal()
      
    });
  }

}
