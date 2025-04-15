import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import 'moment/locale/ru';
import { cloneDeep, find, extend } from 'lodash';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import _ from 'lodash';


@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule, CommonModule, HeaderModule, EventModule, IonModal, TabsComponent, TabsItemComponent,StandartInputSearchComponent]
})
export class EventsTapePageComponent  implements OnInit {

  formatedEvents: { groupMonth: string, events: IEvent[] }[] = [];
  formatedExpiredEvents: { groupMonth: string, events: IEvent[] }[] = [];
  constructor() {
   
   }

  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  loadingService:LoadingService = inject(LoadingService)
  eventTapeService: EventTapeService = inject(EventTapeService)
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  regionModalState:boolean = false
  resultsFilesUpload!:[
    {
      file:File,
      localPath:string,
    }
  ]|any 
  userService: UserService = inject(UserService)
  tableModalValue:boolean = false
  googleTabsLink:string = ''
  searchRegionItems:any[] = []
  regionFilterName:string = 'Россия'

  isDragOver = false;
   allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/rtf',
    'application/vnd.oasis.opendocument.text'
  ];
  regionFilterId:string = ''
  uploadResultModalState:boolean = false
  expiredEvents:IEvent[]=[]
  mapService:MapService = inject(MapService)
  startEvents: IEvent[]=[]


 
  redirectInTracks(){
    this.navController.navigateForward('/tracks')
  }

  closetTableModal(){
    this.tableModalValue = false
  }

  redirectInConfirm(id:number){
    this.navController.navigateForward(`/aplication/confirm/${id}`)
  }
  onDragOver(event: DragEvent) {
    event.preventDefault(); 
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    this.isDragOver = false;
  }
  getResultFile(event:any){
    this.isDragOver = false;
    const input = event.target as HTMLInputElement;
   
  if (input.files) {
    Array.from(input.files).forEach(file => {
      if (!this.allowedTypes.includes(file.type)) {
        console.warn('Неподдерживаемый тип файла:', file.name, file.type);
        return;
      }
      const isDuplicate = this.resultsFilesUpload.some((existing:any) =>
        existing.file.name === file.name &&
        existing.file.size === file.size &&
        existing.file.lastModified === file.lastModified
      );

      if (!isDuplicate) {
        const reader = new FileReader();
        reader.onload = () => {
          this.resultsFilesUpload.push({
            file: file,
            localPath: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      } else {
        
      }
    });

    // Сброс input
    this.fileInput.nativeElement.value = '';
  }
  }

  deleteUploudResultFile(file:any){
    this.resultsFilesUpload = this.resultsFilesUpload.filter((uploadFile:any)=> uploadFile.localPath !== file.localPath)
  }

  openUploadResultMpdal(){
    this.resultsFilesUpload = []
    this.uploadResultModalState = true
  }

  closeUploadResultModalState(){
    this.uploadResultModalState = false
  }

  getRegions(){
    this.mapService.getAllRegions(true, false, false).pipe().subscribe((res:any)=>{
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

  addResultFilesInRace(raceId:number){
    
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

    this.eventService.getAllEvents({dateEnd:moment().subtract(2, 'days').locale('ru'). format('YYYY-MM-DD'), locationId:[this.regionFilterId], sortField:'date_start', sort:'desc',commissionUser:1,
      userIdExists: this.userService.user.value?.id ? this.userService.user.value?.id: ''} //.subtract(7,'days')
  ).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.expiredEvents = res.races

      this.formatedExpiredEvents = Object.keys(_.groupBy(this.expiredEvents, event => moment(event.date_start).locale('ru').format('MMMM YYYY')))
      .map(groupMonth => ({
      groupMonth: groupMonth.charAt(0).toUpperCase() + groupMonth.slice(1),
      events: _.groupBy(this.expiredEvents, event => moment(event.date_start).locale('ru').format('MMMM YYYY'))[groupMonth]
      }));
    })

  }

  getStartEvents(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })

    this.eventService.getAllEvents({dateStart:moment().subtract(2,'days').format('YYYY-MM-DD'),locationId:[this.regionFilterId], sortField:'date_start', sort:'asc', commissionUser:1,
       userIdExists: this.userService.user.value?.id ? this.userService.user.value?.id: '' }).pipe(
      finalize(()=>{ 
        this.loadingService.hideLoading(loader)
      })).subscribe((res:any)=>{
        this.startEvents = res.races
        this.formatedEvents = Object.keys(_.groupBy(this.startEvents, event => moment(event.date_start).locale('ru').format('MMMM YYYY')))
      .map(groupMonth => ({
      groupMonth: groupMonth.charAt(0).toUpperCase() + groupMonth.slice(1),
      events: _.groupBy(this.startEvents, event => moment(event.date_start).locale('ru').format('MMMM YYYY'))[groupMonth]
      }));
    })

  }

  ionViewWillEnter(){

    this.getStartEvents()
    this.getExpiredEvents()
    this.switchTypeService.setTypeInLocalSorage('events')

  }
 
  ngOnInit() {
    this.getRegions()
    window.addEventListener('popstate', (event) => {
      this.closetTableModal()
      
    });
  }

}

