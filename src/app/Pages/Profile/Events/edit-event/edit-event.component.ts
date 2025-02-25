import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
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
import { IonCheckbox, IonModal, NavController } from '@ionic/angular/standalone';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { GroupService } from 'src/app/Shared/Data/Services/Race/group.service';


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  imports: [SharedModule,HeaderModule,StepsModule,FormsModule,EditSliderComponent,TrackModule,IonModal,IonCheckbox]
})
export class EditEventComponent  implements OnInit {

  constructor() { }

    private readonly destroy$ = new Subject<void>()

    trackSelectedModalState:boolean = false;
    trackSelected: Track | undefined

    eventId: string = ''
    
    groupModal:boolean = false

    checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)

    route: ActivatedRoute = inject(ActivatedRoute)

    eventService:EventService = inject(EventService)
    trackService:TrackService = inject(TrackService)

    event!:IEvent
    backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`

    loadingService: LoadingService = inject(LoadingService)

    deletesImages:any[] = []

    toastService: ToastService = inject(ToastService)
    navController: NavController = inject(NavController)

    userService:UserService = inject(UserService)

    maxStepsCount: number = 1
    stepCurrency: number = 1
    allClassesState:boolean = true

    locationId:string = ''

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


    createEventForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
        images: new FormControl('', [Validators.required, Validators.minLength(1)]),
        region: new FormControl('', [Validators.required, Validators.minLength(1)]),
        locationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
        dateStart: new FormControl('', [Validators.required, Validators.minLength(1)]),
        recordEnd:new FormControl('', [Validators.required, Validators.minLength(1)]),
    })
   
    
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
        this.createEventForm.patchValue({region:region.name})
        this.createEventForm.patchValue({locationId:region.value})
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

     getTracks(){
        this.loadingService.showLoading()
        this.trackService.getTracks().pipe(
          finalize(()=>{
            this.loadingService.hideLoading()
          })
        ).subscribe((res:any)=>{
          this.tracks = res.tracks
        })
      }

      selectTrack(track:Track){
        this.trackSelected = track
        this.closeTrackSelectModalFunction()
      }

      stepInvalidate() {
        if (this.createEventForm.value) {
          switch (this.stepCurrency) {
            case 1:
              if (
                this.createEventForm.value.name.length <= 3 ||
                this.createEventForm.value.desc.length <= 3 
               || 
               !this.createEventForm.value.dateStart 
               ||  !this.trackSelected || !this.createEventForm.value.locationId
              ) {
                return true
              } 
              else {
                return false
              }
              
            default:
              return false
          }
        } else {
          return true
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

          this.createEventForm.patchValue({
            ...res.race,
            locationId: res.race?.location?.id,
            region: `${res.race?.location?.type} ${ res.race?.location?.name}`,
            recordEnd: moment(res.race.record_end).format('YYYY-MM-DD HH:mm'),
            dateStart: moment(res.race.date_start).utc().format('YYYY-MM-DD HH:mm'),
            images:  this.event.images? this.event.images?.map((image:string)=>{ return {
               link:this.checkImgUrlPipe.checkUrlDontType(image),
               name:`${crypto.randomUUID()}`
              }
            }):[]
          })
          this.createEventForm.patchValue({
            desc:this.event.desc!.replace(/  /g, '&nbsp;&nbsp;')
          })
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
        trackId: this.trackSelected!.id,
        imagesAdd: _.cloneDeep(this.createEventForm.value.images),
        resultsFile: this.positionFile instanceof File? this.positionFile : null,
        positionFile: this.reglamentFile instanceof File? this.reglamentFile : null,
        imagesDel: this.deletesImages.map((image:string)=>image.split(`${this.backendUrl}/storage/`)[1])
      }
  
      let editEventFormData:FormData = new FormData()
      editEventFormData.append('name', editForm.name)
      editEventFormData.append('desc', editForm.desc)
      editEventFormData.append('locationId',String(editForm.locationId))
      editEventFormData.append('dateStart',editForm.dateStart)
      editEventFormData.append('recordEnd',editForm.recordEnd)
      editEventFormData.append('trackId',String(editForm.trackId))

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
        this.toastService.showToast('Событие успешно изменено','success')
        this.navController.back()
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
              })
      }

  ngOnInit() {}

}
