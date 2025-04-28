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
import { UploadFileInputComponent } from '@app/Shared/Components/UI/upload-file-input/upload-file-input.component';
import { NoDataFoundComponent } from "../../../Shared/Components/UI/no-data-found/no-data-found.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RegionsSelectModalComponent } from '@app/Shared/Components/Modals/regions-select-modal/regions-select-modal.component';
import { NavbarVisibleService } from '@app/Shared/Services/navbar-visible.service';


@Component({
  selector: 'app-events-tape-page',
  templateUrl: './events-tape-page.component.html',
  styleUrls: ['./events-tape-page.component.scss'],
  imports: [SharedModule, CommonModule, HeaderModule,
    EventModule, IonModal, TabsComponent, TabsItemComponent,
    StandartInputSearchComponent, UploadFileInputComponent,StandartInputComponent,
    NoDataFoundComponent, NoDataFoundComponent, PdfViewerModule, CheckImgUrlPipe,RegionsSelectModalComponent]
})
export class EventsTapePageComponent  implements OnInit {

  formatedEvents: { groupMonth: string, events: IEvent[] }[] = [];
  formatedExpiredEvents: { groupMonth: string, events: IEvent[] }[] = [];
  constructor() {
   
   }

  navBarVisibleService:NavbarVisibleService = inject(NavbarVisibleService)

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
  searchForm:FormGroup = new FormGroup({
    searchLabael: new FormControl('')
  })
  userService: UserService = inject(UserService)
  tableModalValue:boolean = false
  googleTabsLink:string = ''
  searchRegionItems:any[] = []
  regionFilterName:string = 'Россия'
  currentRace!:IEvent 
  zoomLevel = 1.0;
  isDragOver = false;
  allowedTypes = [
    'application/pdf',
  ];
  regionFilterId:string = ''
  uploadResultModalState:boolean = false
  expiredEvents:IEvent[]=[]
  clearUploadFiles:boolean = false
  mapService:MapService = inject(MapService)
  startEvents: IEvent[]=[]
  resultsFilesUploadArrayClear:any[] = []
  formattedResultsDocument:[
    {
      path:string,
      zoomLevel:number
    }
  ]|any[] = []

 
  redirectInTracks(){
    this.navController.navigateForward('/tracks')
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
  formatingZoomValuesInResults(){
    this.formattedResultsDocument = []
    this.clearUploadFiles = false
    this.currentRace.pdf_files.forEach((file:any)=>{
      this.formattedResultsDocument.push({
        path:file,
        zoomLevel:1,
      })
    })
  }
  submitResultInRace(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>loader = res)
    const fd:FormData = new FormData()
  
    this.resultsFilesUpload.forEach((fileElement:any,index:number) => {
        fd.append(`pdfFiles[${index}]`,fileElement.file)
    });
    fd.forEach((value, key) => {
      console.log(key, value);
    });

    this.eventService.addResultInRace(String(this.currentRace.id),fd).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)
        this.resultsFilesUploadArrayClear = []
      })
    ).subscribe((res:any)=>{
      this.currentRace = res.race
      this.formatingZoomValuesInResults()
    })
  }
  deleteResultFile(file:any){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.eventService.deleteResultInRace(String(this.currentRace.id),[file.path]).pipe(
      finalize(()=>this.loadingService.hideLoading(loader))
    ).subscribe((res:any)=>{
      this.currentRace = res.race
      this.formatingZoomValuesInResults()
    })
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    this.isDragOver = false;
  }
 
  getUploadResultsFiles(files:any){
    console.log(files)
    this.resultsFilesUpload = files
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

  openUploadResultModal(event:any){
    this.resultsFilesUpload = []
    this.formattedResultsDocument = []
    this.currentRace = event
    this.formatingZoomValuesInResults()
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
    this.navBarVisibleService.hideNavBar()
  }
  closeRegionModal(){
    setTimeout(()=>{
      this.navBarVisibleService.showNavBar()
    },100)
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
      this.closeUploadResultModalState()
    });
  }

}

