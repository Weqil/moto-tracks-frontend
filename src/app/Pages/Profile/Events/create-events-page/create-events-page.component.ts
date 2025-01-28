import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { NavController } from '@ionic/angular/standalone';
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

@Component({
  selector: 'app-create-events-page',
  templateUrl: './create-events-page.component.html',
  styleUrls: ['./create-events-page.component.scss'],
  imports: [SharedModule,HeaderModule,StepsModule,ButtonsModule,FormsModule,EditSliderComponent,TrackModule]
})
export class CreateEventsPageComponent  implements OnInit {

  constructor() { }
  trackSelectedModalState:boolean = false;
  trackSelected: Track | undefined
  eventService:EventService = inject(EventService)

  trackService:TrackService = inject(TrackService)
  loadingService: LoadingService = inject(LoadingService)
  toastService: ToastService = inject(ToastService)
  
  maxStepsCount: number = 1
  stepCurrency: number = 1

  tracks!: Track[] 

  createEventForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
    images: new FormControl('', [Validators.required, Validators.minLength(1)]),
    dateStart: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })
  navController: NavController = inject(NavController)

  stepPrevious() {
    if (this.stepCurrency > 1) {
      this.stepCurrency--
    }else{
      this.navController.back()
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
           || !this.createEventForm.value.images.length
          ) {
            return true
          } else {
            return false
          }
        case 2:
          if(
            !this.createEventForm.value.dateStart ||  !this.trackSelected
            
          ){
            return true
          }else{
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

  ionViewWillEnter(){
    this.getTracks()
  }

  submitForm(){
   if(!this.stepInvalidate()){
    this.loadingService.showLoading()
    let createEventFormData: FormData = new FormData()
   
    for(let key in this.createEventForm.value){
      createEventFormData.append(key, this.createEventForm.value[key])
    }
    for (var i = 0; i < this.createEventForm.value.images.length; i++) {
      createEventFormData.append('images[]', this.createEventForm.value.images[i])
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


