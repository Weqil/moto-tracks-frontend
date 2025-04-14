import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';
import moment from 'moment';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import * as _ from 'lodash';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { environment } from 'src/environments/environment';
import { IonCheckbox, IonModal, NavController, IonLabel } from '@ionic/angular/standalone';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { GroupService } from 'src/app/Shared/Data/Services/Race/group.service';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';
import { InfoPopoverComponent } from "../../../../Shared/Components/UI/info-popover/info-popover.component";


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  imports: [IonLabel, SharedModule, HeaderModule, StepsModule, FormsModule, EditSliderComponent, TrackModule, IonModal, IonCheckbox, StandartInputSelectComponent, InfoPopoverComponent, CheckImgUrlPipe]
})
export class EditEventComponent  implements OnInit {

  constructor() { }

    private readonly destroy$ = new Subject<void>()

    trackSelectedModalState:boolean = false;
    schemeUrl:string = ''
    trackSelected: Track | undefined
    currentComission:any[] = []
    eventId: string = ''
    raceTypeSelectedItem: any = {name:'', value:''}
    raceTypes:any[] = [
      {name:'Предварительная', value:2},
      {name:'Согласована (обычная)', value:3},
    ]
    groupModal:boolean = false

    checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)

    route: ActivatedRoute = inject(ActivatedRoute)

    eventService:EventService = inject(EventService)
    trackService:TrackService = inject(TrackService)

    event!:IEvent
    backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`

    loadingService: LoadingService = inject(LoadingService)

    deletesImages:any[] = []

    comissionModalState:boolean = false

    toastService: ToastService = inject(ToastService)
    navController: NavController = inject(NavController)

    userService:UserService = inject(UserService)

    maxStepsCount: number = 1
    stepCurrency: number = 1
    allClassesState:boolean = true

    locationId:string = ''
    usersInCommision:any[] = []
    sliderImages:any

    newGroupInputValue:string = ''
    userGroups:any[] = []
    allUsersGroups:any[] = []
    selectedGroup:any[] = []

    searchRegionItems:any[] = []
    groupService:GroupService = inject(GroupService)

    mapService:MapService = inject(MapService)

    regionModalState:boolean = false
  
    reglamentFile!:File | {name: string, path: string}
    positionFile!:File  | {name: string, path: string}
    
  
    tracks!: Track[] 
    allTracks!: Track[]

    

    createEventForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
        images: new FormControl('', [Validators.required, Validators.minLength(1)]),
        region: new FormControl('', [Validators.required, Validators.minLength(1)]),
        locationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
        dateStart: new FormControl('', [Validators.required, Validators.minLength(1)]),
        recordStart:new FormControl('', [Validators.required, Validators.minLength(1)]),
        recordEnd:new FormControl('', [Validators.required, Validators.minLength(1)]),
        statusId: new FormControl( '',  [Validators.required, Validators.minLength(1)]),
    })

    setScheme(event:any,input:HTMLInputElement){
      const file = event.target.files[0]
      if(file){
        this.createEventForm.patchValue({ schemaImg: file })
        const reader: FileReader = new FileReader()
        reader.onload = (e: any) => {
          this.schemeUrl = e.target.result
        }
        reader.readAsDataURL(file)
        input.value =''
      }
    }
   
    
    stepPrevious() {
        if (this.stepCurrency > 1) {
          this.stepCurrency--
        }else{
          this.navController.back()
        }
     }

    trackHaveInUserSelected(event:any){
      return !!this.selectedGroup.find((item:any) => item.id === event.id)
    }

    changeGroup(event:any, group:any){
      if(this.selectedGroup.find((item:any) => item.id === group.id)){
        this.selectedGroup = this.selectedGroup.filter((item: any) => item.id !== group.id)
      }
      else {
        this.selectedGroup.push(group)
      }
     }
     
     setNewGroupInputValue(event:any){
      this.newGroupInputValue = event.target.value
     }

     getAllGroups(){
      this.groupService.getAllGroup({userId:this.userService.user.value?.id}).pipe().subscribe((res:any)=>{
       this.userGroups = res.grades
      })
      this.groupService.getAllGroup().pipe().subscribe((res:any)=>{
       this.allUsersGroups = res.grades
      })
     }

     createNewGroup(){
      if(this.newGroupInputValue.length){
        this.loadingService.showLoading()
        this.groupService.createGroup({name:this.newGroupInputValue}).pipe(
          finalize(()=>{
            this.loadingService.hideLoading()
          })
        ).subscribe((res:any)=>{
          this.getAllGroups()
          this.toastService.showToast('Новый класс гонки создан успешно','success')
          this.newGroupInputValue = ''
        })
      }
    }

    setRegion(region:any){
      this.closeRegionModal()
      this.locationId = region.value
      this.trackSelected = undefined
      this.createEventForm.patchValue({region:region.name})
      this.createEventForm.patchValue({locationId:region.value})
    }

    getCurrentCommissions(){
      this.loadingService.showLoading()
      this.eventService.getEventById(this.eventId,{
        userId:String(this.userService.user.value?.id ? this.userService.user.value?.id : '' ),
        appointmentUser:1,
      }).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
          
        })
      ).subscribe((res:any)=>{
        
        res.race.commissions.forEach((user:any)=> {
          this.currentComission.push({
            value:user.id,
            name:user.personal?.surname +" " + user.personal?.name + " "  + user.personal?.patronymic,
          })
        });

        console.log("Комиссия выбранная при получении:")
        console.log(this.currentComission)
        
      })
      
    }

    getCommisionUsers(){
      this.userService.getComissionUsers().pipe().subscribe((res:any)=>{
        res.users.forEach((user:any) => {
          this.usersInCommision.push({
            value:user.id,
            name:user.personal?.surname +" " + user.personal?.name + " "  + user.personal?.patronymic,
            
          })
        });
        console.log("Комиссия в целом:")
        console.log(this.usersInCommision)
        console.log("Комиссия выбранная:")
        console.log(this.currentComission)
      })
    }

    setComission(event:any){
      if(this.currentComission.find((user:any)=>user.value == event.value)){
        console.log('такой юзер уже есть')
        console.log(this.currentComission)
      }else {
        this.currentComission.push(event)
        console.log('В комиссию записали event')
        // console.log('Выбранная комиссия')
        // console.log(this.currentComission)
        console.log('Event это:')
        console.log(event)
  
      }
      this.closeComissionModal()
    }
  

    getRegions(){
        this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
          res.data.forEach((region:any) => {
            this.searchRegionItems.push({
              name:`${region.name} ${region.type}`,
              value:region.id
            })
          });
        })
      }

      changeAllClassesState(){
        this.allClassesState =!this.allClassesState
      }

      openModalGroupModal(){
        this.groupModal = true
      }
      closeGroupModal(){
        this.groupModal = false
      }
    
    setReglamentFile(file: any) {
        const selectedFile = file.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
          this.reglamentFile = selectedFile;
        } else {
          this.toastService.showToast('Документ должен быть фоматом pdf','warning')
        }
      }
      
    setPositionFile(file: any) {
        const selectedFile = file.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
          this.positionFile = selectedFile;
        } else {
          this.toastService.showToast('Документ должен быть фоматом pdf','warning')
        }
      }

      closeRegionModal(){
        this.regionModalState = false
      }
      openRegionModal(){
        this.regionModalState = true
      }

      deleteComission(event:any){
        this.currentComission = this.currentComission.filter((user:any)=>event !== user)
      }
      closeComissionModal(){
        this.comissionModalState = false
      }
      openComissionModal(){
        this.comissionModalState = true
      }
     

     getTracks(){
        this.loadingService.showLoading()
        this.trackService.getTracks().pipe(
          finalize(()=>{
            this.loadingService.hideLoading()
          })
        ).subscribe((res:any)=>{
          this.tracks = res.tracks
          this.allTracks = res.tracks
        })
      }

      selectTrack(track:Track){
        this.trackSelected = track
        let region = this.searchRegionItems.find((item)=>item.value == this.trackSelected!.location.id)
        this.createEventForm.patchValue({region:region.name})
        this.createEventForm.patchValue({locationId:region.value})
        
        this.closeTrackSelectModalFunction()
      }

      stepInvalidate() {
        if(this.raceTypeSelectedItem.name == 'Согласована (обычная)'){
          if (this.createEventForm.value) {
            
            if (
                this.createEventForm.value.name.length <= 3 ||
               !this.createEventForm.value.images.length ||   
               !this.createEventForm.value.dateStart ||  
               !this.trackSelected ||
              //  !this.currentComission.length ||
                !this.locationId || 
                !this.selectedGroup.length ||
                !this.createEventForm.value.recordStart||
                !this.createEventForm.value.recordEnd
              ) {
                return true
              } else {
                return false
              }
              
          } else {
            return true
          }
        }else{
          if(this.createEventForm.value.name.length <= 3 || 
            // !this.currentComission.length ||
             this.createEventForm.value.region.length <= 3 || this.createEventForm.value.dateStart.length <= 3  ) {
            return true
          }else{
            return false
          }
        }
       
      }

      stepNext() {
        if (this.stepCurrency <= this.maxStepsCount && !this.stepInvalidate() ) {
          this.stepCurrency++
        }
      }

      cancelCreate(){
        this.navController.back()
      }

      getImages(event:any){
        if(event.length < this.sliderImages.length ){
          if(this.sliderImages.find((image:any) => !event.includes(image)).link){
            let link = this.sliderImages.find((image:any) => !event.includes(image)).link
            if (this.deletesImages.indexOf(link) === -1) {
              this.deletesImages.push(link)
            }
          }
        }
      
        this.createEventForm.patchValue({
          images: event
        })
      }

      openTrackSelectModalFunction(){
        if(this.createEventForm.value.locationId){
         
          this.tracks = this.allTracks.filter((track) => Number(track.location?.id) == Number(this.createEventForm.value.locationId))
      
        }
        this.trackSelectedModalState = true;
      }
    
       closeTrackSelectModalFunction(){
        this.trackSelectedModalState = false;
      }
    
      getEvent(){
        this.loadingService.showLoading()
        this.eventService.getEventById(this.eventId,{
          userId:String(this.userService.user.value?.id ? this.userService.user.value?.id : '' ),
          appointmentUser:1,
        }).pipe(
          finalize(()=>{
            this.loadingService.hideLoading()
            this.getTracks()
          })
        ).subscribe((res:any)=>{
          this.event = res.race
          this.trackSelected = this.event.track

          if(this.event.results_file){
            this.reglamentFile = {
              name:'Файл загружен',
              path: String(this.event.results_file)
            }
          }
          if(this.event.position_file){
            this.positionFile = {
              name:'Файл загружен',
              path: String(this.event.position_file)
            }
          }
          this.selectEditType()
          this.locationId = res.race?.location?.id
          
          this.createEventForm.patchValue({
            ...res.race,
            locationId: res.race?.location?.id,
            region: `${res.race?.location?.type} ${ res.race?.location?.name}`,
            recordEnd: moment(res.race.record_end).format('YYYY-MM-DD HH:mm'),
            recordStart: moment(res.race.record_start).format('YYYY-MM-DD HH:mm'),
            dateStart: moment(res.race.date_start).utc().format('YYYY-MM-DD HH:mm'),
            images:  this.event.images? this.event.images?.map((image:string)=>{ return {
               link:this.checkImgUrlPipe.checkUrlDontType(image),
               name:`${crypto.randomUUID()}`
              }
            }):[]
          })
          if(this.event.desc){
            this.createEventForm.patchValue({
              desc:this.event.desc!.replace(/  /g, '&nbsp;&nbsp;')
            })
          }
          this.sliderImages = this.createEventForm.value.images
          this.selectedGroup = this.event.grades
        })
        
      }

     


    submitForm(){
      if(!this.stepInvalidate()){

      this.loadingService.showLoading()
      this.createEventForm.value.images = this.createEventForm.value.images.filter((image:any)=>!image.link)
      let editForm = {
        ...this.createEventForm.value,
        trackId: this.trackSelected?.id,
        imagesAdd: _.cloneDeep(this.createEventForm.value.images),
        statusId:this.raceTypeSelectedItem.value,
        resultsFile: this.positionFile instanceof File? this.positionFile : null,
        positionFile: this.reglamentFile instanceof File? this.reglamentFile : null,
        imagesDel: this.deletesImages.map((image:string)=>image.split(`${this.backendUrl}/storage/`)[1])
      }
  
      let editEventFormData:FormData = new FormData()
      editEventFormData.append('name', editForm.name)
      editEventFormData.append('desc', editForm.desc)
      editEventFormData.append('locationId',String(editForm.locationId))
      editEventFormData.append('dateStart',editForm.dateStart)
      if(this.raceTypeSelectedItem.value !== 2){
        editEventFormData.append('recordStart',editForm.recordStart)
        editEventFormData.append('recordEnd',editForm.recordEnd)
        editEventFormData.append('trackId',String(editForm.trackId))
      }
   
      editEventFormData.append('statusId',String(editForm.statusId))

      for (var i = 0; i < this.selectedGroup.length; i++) {
        editEventFormData.append('gradeIds[]', this.selectedGroup[i].id)
      }

      if(this.reglamentFile instanceof File){
        editEventFormData.append('resultsFile', this.reglamentFile)
      }

      if(this.positionFile instanceof File){
        editEventFormData.append('positionFile', this.positionFile)
      }
  
    
      for (var i = 0; i < editForm.imagesAdd.length; i++) {
        editEventFormData.append('imagesAdd[]', editForm.imagesAdd[i])
      }
      for (var i = 0; i < editForm.imagesDel.length; i++) {
        editEventFormData.append('imagesDel[]', editForm.imagesDel[i])
      }
      
      this.eventService.updateEvent(editEventFormData,this.eventId).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        })
      ).subscribe((res:any)=>{
        let loader:HTMLIonLoadingElement
        let race:any = res.race
        this.loadingService.showLoading().then((res:HTMLIonLoadingElement)=>loader = res)
        
        if(this.currentComission.length !== 0)

          {
            this.userService.addComission(race.id,this.currentComission.map(user => user.value || user.id)).pipe(
        catchError(error => {

          this.navController.navigateForward('/my-events')
          this.loadingService.hideLoading(loader)
          return throwError(()=> error)
          
        }),
        finalize(()=>this.loadingService.hideLoading(loader))
        ).subscribe((res:any)=>{
        this.navController.navigateForward('/my-events')
        }
      )}else{
        this.userService.addComission(race.id,this.currentComission.map(user => user.value || user.id)).pipe(
          catchError(error => {
  
            this.navController.navigateForward('/my-events')
            this.loadingService.hideLoading(loader)
            return throwError(()=> error)
            
          }),
          finalize(()=>this.loadingService.hideLoading(loader))
          ).subscribe((res:any)=>{
          this.navController.navigateForward('/my-events')
          }
        )
      }

      })
    }
    } 
    setRaceType(event:any){
      this.raceTypeSelectedItem = event
      this.createEventForm.patchValue({
        statusId:event.value
      })
    }
    selectEditType(){
      if(this.event.status){
        this.raceTypeSelectedItem = {
          name: this.event.status?.id == 2 ? 'Предварительная':'Согласована (обычная)' ,
          value:this.event.status?.id
        }
      }else{
        this.raceTypeSelectedItem = {
          name: 'Предварительная',
          value: 2
        }
        this.createEventForm.patchValue({
          statusId: 2
        })
      }
    
    } 

    ionViewWillEnter(){
         this.getRegions()
         
         this.getAllGroups()
         this.route.params.pipe(takeUntil(this.destroy$)).pipe(
                finalize(()=>{
              })
            ).subscribe((params) => {
                this.eventId = params['id']
                this.getEvent()
                this.getCommisionUsers()
                this.getCurrentCommissions()
              })
      }

  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closeGroupModal()
      
  })
   
  }

}
