import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonCheckbox, IonLabel, IonModal, NavController } from '@ionic/angular/standalone';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { selectedModule } from 'src/app/Shared/Modules/selected/selected.module';
import { StandartInputSelectComponent } from "../../../../Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component";
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { GroupService } from 'src/app/Shared/Data/Services/Race/group.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import moment from 'moment-timezone';

@Component({
  selector: 'app-create-events-page',
  templateUrl: './create-events-page.component.html',
  styleUrls: ['./create-events-page.component.scss'],
  imports: [SharedModule, HeaderModule, StepsModule, ButtonsModule, FormsModule, EditSliderComponent, TrackModule,
     selectedModule, StandartInputSelectComponent, IonModal, IonCheckbox, IonLabel]
})
export class CreateEventsPageComponent  implements OnInit {

  constructor() { }
  trackSelectedModalState:boolean = false;
  trackSelected: Track | undefined
  eventService:EventService = inject(EventService)

  groupService:GroupService = inject(GroupService)

  trackService:TrackService = inject(TrackService)

  allClassesState:boolean = false

 userService:UserService = inject(UserService)

  loadingService: LoadingService = inject(LoadingService)
  toastService: ToastService = inject(ToastService)
  
  maxStepsCount: number = 1
  stepCurrency: number = 1

  locationId:string = ''

  searchRegionItems:any[] = []

  mapService:MapService = inject(MapService)

  reglamentFile!:File
  positionFile!:File

  groupModal:boolean = false



  newGroupInputValue:string = ''
  userGroups:any[] = []
  allUsersGroups:any[] = []
  selectedGroup:any[] = []

  regionModalState:boolean = false

  tracks!: Track[] 

  createEventForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
    images: new FormControl('', [Validators.required, Validators.minLength(1)]),
    region:new FormControl('', [Validators.required, Validators.minLength(1)]),
    locationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
    dateStart: new FormControl( this.getDefaultDateTime(),  [Validators.required, Validators.minLength(1)]),
  })
  navController: NavController = inject(NavController)

  stepPrevious() {
    if (this.stepCurrency > 1) {
      this.stepCurrency--
    }else{
      this.navController.back()
    }
  }

  getDefaultDateTime(): string {
    const userTimezone = moment.tz.guess(); // Определяет текущий часовой пояс пользователя
    return moment().tz(userTimezone).set({ hour: 9, minute: 0, second: 0 }).format('YYYY-MM-DDTHH:mm');
  }

 

 changeAllClassesState(){
   this.allClassesState =!this.allClassesState
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

  openModalGroupModal(){
    this.groupModal = true
  }
  closeGroupModal(){
    this.groupModal = false
  }
  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
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

  setReglamentFile(file: any) {
    const selectedFile = file.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      this.reglamentFile = selectedFile;
    } else {
      this.toastService.showToast('Документ должен быть фоматом pdf','warning')
    }
  }
  
  setRegion(region:any){
    this.closeRegionModal()
    this.locationId = region.value
    this.createEventForm.patchValue({region:region.name})
    this.createEventForm.patchValue({locationId:region.value})
  }

  setPositionFile(file: any) {
    const selectedFile = file.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      this.positionFile = selectedFile;
    } else {
      this.toastService.showToast('Документ должен быть фоматом pdf','warning')
    }
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
           || !this.createEventForm.value.images.length ||   
           !this.createEventForm.value.dateStart ||  !this.trackSelected || !this.locationId
          ) {
            return true
          } else {
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

  setNewGroupInputValue(event:any){
    this.newGroupInputValue = event.target.value
  }

  ionViewWillEnter(){
    this.getAllGroups()
    this.getRegions()
    this.getTracks()
  }

  submitForm(){
   if(!this.stepInvalidate()){
    this.loadingService.showLoading()
    let createEventFormData: FormData = new FormData()
   
    for(let key in this.createEventForm.value){
      createEventFormData.append(key, this.createEventForm.value[key])
    }
    if(this.reglamentFile){
      createEventFormData.append('resultsFile', this.reglamentFile)
    }
    if(this.positionFile){
      createEventFormData.append('positionFile', this.positionFile)
    }
    for (var i = 0; i < this.createEventForm.value.images.length; i++) {
      createEventFormData.append('images[]', this.createEventForm.value.images[i])
    }
    for (var i = 0; i < this.selectedGroup.length; i++) {
      createEventFormData.append('gradeIds[]', this.selectedGroup[i].id)
    }

    createEventFormData.append('trackId', String(this.trackSelected?.id))
    this.eventService.createEvent(createEventFormData).pipe(finalize(()=>{
      this.loadingService.hideLoading()
    }),
    catchError((err:serverError)=>{
      this.toastService.showToast('Возникла ошибка', 'danger')
      return EMPTY
    })
  ).subscribe((res)=>{
      this.toastService.showToast('Событие успешно создано', 'primary')
      this.navController.back()
    })
   }
  }

  ngOnInit() {

  }

}


