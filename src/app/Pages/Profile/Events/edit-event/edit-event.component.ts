import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { NavController } from '@ionic/angular';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  imports: [SharedModule,HeaderModule,StepsModule,ButtonsModule,FormsModule,EditSliderComponent,TrackModule]
})
export class EditEventComponent  implements OnInit {

  constructor() { }
    trackSelectedModalState:boolean = false;
    trackSelected: Track | undefined
    eventService:EventService = inject(EventService)
  
    trackService:TrackService = inject(TrackService)
    loadingService: LoadingService = inject(LoadingService)
    toastService: ToastService = inject(ToastService)
    navController: NavController = inject(NavController)
    maxStepsCount: number = 1
    stepCurrency: number = 1
  
    reglamentFile!:File
    positionFile!:File
  
    tracks!: Track[] 


     createEventForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
        images: new FormControl('', [Validators.required, Validators.minLength(1)]),
        dateStart: new FormControl('', [Validators.required, Validators.minLength(1)]),
      })
   
    
      stepPrevious() {
        if (this.stepCurrency > 1) {
          this.stepCurrency--
        }else{
          this.navController.back()
        }
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
               !this.createEventForm.value.dateStart 
               ||  !this.trackSelected
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
    
      ionViewWillEnter(){
        this.getTracks()
      }

  ngOnInit() {}

}
