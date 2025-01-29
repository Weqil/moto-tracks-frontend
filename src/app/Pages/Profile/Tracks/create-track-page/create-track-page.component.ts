import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import { NavController, Platform } from '@ionic/angular/standalone';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { StandartRichInputComponent } from "../../../../Shared/Components/Forms/standart-rich-input/standart-rich-input.component";
import { IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { AddressInputComponent } from "../../../../Shared/Components/Forms/address-input/address-input.component";
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';

@Component({
  selector: 'app-create-track-page',
  templateUrl: './create-track-page.component.html',
  styleUrls: ['./create-track-page.component.scss'],
  imports: [SharedModule, HeaderComponent, ButtonsModule, StepsModule, FormsModule, EditSliderComponent, StandartRichInputComponent, AddressInputComponent]
})
export class CreateTrackPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)

  maxStepsCount: number = 1
  stepCurrency: number = 1

  trackService: TrackService = inject(TrackService)
  loadingService: LoadingService = inject(LoadingService)
  toastService: ToastService = inject(ToastService)
  platform:Platform = inject(Platform)

  newParams: [{temp_id:any, title:string, value:string}]|any = []
  createTrackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    latitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    longitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    free: new FormControl('', [Validators.required, Validators.minLength(3)]),
    turns: new FormControl('', [Validators.required, Validators.minLength(3)]),
    length: new FormControl('', [Validators.required, Validators.minLength(3)]),
    desc: new FormControl(`Длина: - 
Ширина: -
Покрытие: -
Направление: -
Левых поворотов: -
Правых поворотов: -

Расписание и время работы:
ПН:
ВТ:
СР:
ЧТ:
ПТ:
СБ:
ВС:
                            `
, [Validators.required, Validators.minLength(3)]),
    level: new FormControl('', [Validators.required, Validators.minLength(3)]),
    images: new FormControl('', [Validators.required, Validators.minLength(3)]),
    is_work: new FormControl(1)
  })


  addNewParameter(){
    this.newParams.push({ temp_id: Date.now(), title: '', value: ''})
  }
  deleteNewParameter(temp_id: any){
    this.newParams = this.newParams.filter((param:any)=> param.temp_id !== temp_id);
  }

  stepInvalidate() {
    if (this.createTrackForm.value) {
      switch (this.stepCurrency) {
        case 1:
          if (
            this.createTrackForm.value.name.length <= 3 ||
            this.createTrackForm.value.desc.length <= 3 
           || !this.createTrackForm.value.images.length
          ) {
            return true
          } else {
            return false
          }
        case 2:
          if(
            !this.createTrackForm.value.address.length ||  !this.createTrackForm.value.latitude || !this.createTrackForm.value.longitude
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
  getImages(event:any){
    console.log(event)
    this.createTrackForm.patchValue({
      images: event
    })
  }
  changeAddress(event:any){
    console.log(event)
    if(event.latitude && event.longitude){
      this.createTrackForm.patchValue({
        latitude: event.latitude,
        longitude: event.longitude,
        address: event.address
      })
    }
   
  }
  stepPrevious() {
   
    if (this.stepCurrency > 1) {
      this.stepCurrency--
    }else{
      this.navController.back()
    }
  }
  stepNext() {
    if (this.stepCurrency <= this.maxStepsCount && !this.stepInvalidate()) {
      this.stepCurrency++
    }
  }
  submitForm(){

    this.loadingService.showLoading()
    let createTrackFormData: FormData = new FormData()
   
    for(let key in this.createTrackForm.value){
      createTrackFormData.append(key, this.createTrackForm.value[key])
    }
    for (var i = 0; i < this.createTrackForm.value.images.length; i++) {
      createTrackFormData.append('images[]', this.createTrackForm.value.images[i])
    }
    this.trackService.createTrack(createTrackFormData).pipe(
      catchError((err:serverError)=>{
        this.toastService.showToast('Возникла ошибка','danger')
        return EMPTY
      }),
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      console.log(res)
      this.toastService.showToast('Трек успешно создан','success')
      this.navController.back()
    })
  
  }

  cancelCreate(){
    this.navController.back()
  }

  ionViewDidLeave() {
    this.stepCurrency = 1
    this.createTrackForm.reset()
  }
  ngOnInit() {

  }

}
