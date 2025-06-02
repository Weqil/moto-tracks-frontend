import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import { IonCheckbox, IonLabel, IonModal, IonToggle, NavController, Platform } from '@ionic/angular/standalone';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';

import { IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { AddressInputComponent } from "../../../../Shared/Components/Forms/address-input/address-input.component";
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';
import { InfoPopoverComponent } from 'src/app/Shared/Components/UI/info-popover/info-popover.component';
import { formdataService } from 'src/app/Shared/Helpers/formdata.service';
import { RegionsSelectModalComponent } from '@app/Shared/Components/Modals/regions-select-modal/regions-select-modal.component';
import { StandartRichInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-rich-input/standart-rich-input.component';
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';
import { CheckBoxComponent } from '@app/Shared/Components/UI/LinarikUI/forms/check-box/check-box.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
@Component({
  selector: 'app-create-track-page',
  templateUrl: './create-track-page.component.html',
  styleUrls: ['./create-track-page.component.scss'],
  imports: [SharedModule, HeaderComponent, StepsModule, EditSliderComponent, 
    AddressInputComponent,IonModal,IonToggle,IonLabel,StandartInputSelectComponent,
    InfoPopoverComponent,IconButtonComponent,IonRadio,CheckBoxComponent,RegionsSelectModalComponent,StandartRichInputComponent,StandartInputComponent]
})
export class CreateTrackPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  formdataService: formdataService = inject(formdataService)
  maxStepsCount: number = 1
  stepCurrency: number = 1
  logoUrl: string = ''
  schemeUrl: string = ''
  coverageSelectedItem:any =  {name:'hard', value:'hard'}

coverageItems:any[] = [
  {name:'mid-hard', value:'mid-hard'},
  {name:'hard', value:'hard'},
  {name:'mid-soft', value:'mid-soft'},
  {name:'soft', value:'soft'},
]

  regionModalState:boolean = false
  mapService:MapService = inject(MapService)

  searchRegionItems:any[] = []

  locationId:string = ''

  trackService: TrackService = inject(TrackService)
  loadingService: LoadingService = inject(LoadingService)
  toastService: ToastService = inject(ToastService)
  platform:Platform = inject(Platform)

  newParams: [{temp_id:any, title:string, value:string}]|any = []

  contactsForm: FormGroup = new FormGroup({
    site: new FormControl('', [Validators.required, Validators.minLength(3)]),
    vk: new FormControl('', [Validators.required, Validators.minLength(3)]),
    trackVideo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    tg: new FormControl('', [Validators.required, Validators.minLength(3)]),
    whatsApp: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  specForm: FormGroup = new FormGroup({
    lengthTrack: new FormControl('', [Validators.required, Validators.minLength(1)]),
    heightDifference: new FormControl('', [Validators.required, Validators.minLength(1)]),
    coverage: new FormControl( this.coverageSelectedItem.value, [Validators.required, Validators.minLength(1)]),
    leftTurns: new FormControl('', [Validators.required, Validators.minLength(1)]),
    rightTurns: new FormControl('', [Validators.required, Validators.minLength(1)]),
    elementsCount: new FormControl('', [Validators.required, Validators.minLength(1)]),
    highSpeedSection: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })

  createTrackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    latitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    longitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apayment: new FormControl(false, [Validators.required, Validators.minLength(3)]),
    logo: new FormControl('', [Validators.required,]),
    light: new FormControl(false, [Validators.required,]),
    season: new FormControl(false, [Validators.required,]),
    parking: new FormControl(false, [Validators.required,]),
    opened: new FormControl(false, [Validators.required,]),
    schemaImg: new FormControl('', [Validators.required,]),
    turns: new FormControl('', [Validators.required, Validators.minLength(3)]),
    region: new FormControl('', [Validators.required, Validators.minLength(3)]),
    locationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
    length: new FormControl('', [Validators.required, Validators.minLength(3)]),
    desc: new FormControl(``, [Validators.required, Validators.minLength(3)]),
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
  penMail() {
    window.location.href = "mailto:admin@vokrug.city";
  }

  stepInvalidate() {
    if (this.createTrackForm.value) {
          if (
            this.createTrackForm.value.name.length <= 3 
           || !this.createTrackForm.value.address.length ||
             !this.createTrackForm.value.latitude 
             || !this.createTrackForm.value.longitude || 
             !this.locationId || !this.createTrackForm.value.schemaImg

            //  || !this.logoUrl || !this.specForm.valid ||
            // this.createTrackForm.value.desc.length <= 3 
          ) {
            return true
          } else {
            return false
            
          }
    } else {
      return true
    }
  }

  clearLogo(){
    this.logoUrl = ''
    this.createTrackForm.patchValue({logo: ''})
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
  setRegion(region:any){
    this.closeRegionModal()
    this.locationId = region.value
    this.createTrackForm.patchValue({region:region.name})
    this.createTrackForm.patchValue({locationId:region.value})
  }

  getImages(event:any){
    this.createTrackForm.patchValue({
      images: event
    })
  }

  changeAddress(event:any){
    if(event.latitude && event.longitude){
      this.createTrackForm.patchValue({
        latitude: event.latitude,
        longitude: event.longitude,
        address: event.address
      })
    }
   
  }
  
  stepPrevious() {

    this.navController.navigateRoot('/create-track')

    // if (this.stepCurrency > 1) {
    //   this.stepCurrency--
    // }else{
    //   this.navController.back()
    // }
  }
  setLogo(event:any, input:HTMLInputElement){
    const file = event.target.files[0]
    if(file){
      this.createTrackForm.patchValue({ logo: file })
      const reader: FileReader = new FileReader()
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result
      }
      reader.readAsDataURL(file)
      input.value =''
    }
  }
  changeLight(event:any){
  
  }
  setScheme(event:any,input:HTMLInputElement){
    const file = event.target.files[0]
    if(file){
      this.createTrackForm.patchValue({ schemaImg: file })
      const reader: FileReader = new FileReader()
      reader.onload = (e: any) => {
        this.schemeUrl = e.target.result
      }
      reader.readAsDataURL(file)
      input.value =''
    }
  }
  back(){
    this.navController.back()
  }
  stepNext() {
    if (this.stepCurrency <= this.maxStepsCount && !this.stepInvalidate()) {
      this.stepCurrency++
    }
  }
  submitForm(){
    if(!this.stepInvalidate()){

      this.specForm.patchValue({coverage: this.coverageSelectedItem.value})
      this.createTrackForm.patchValue({light: Number(this.createTrackForm.value.light), season:Number(this.createTrackForm.value.season)})
  
        let currentForm = {
          ...this.createTrackForm.value,
          spec:[],
          contacts:[],
        }
        this.loadingService.showLoading()
        let createTrackFormData: FormData = new FormData()
        
        let i = 0
        for(let key in this.specForm.value){
          createTrackFormData.append(`spec[${i}][title]`, key);
          createTrackFormData.append(`spec[${i}][value]`, this.specForm.value[key]);
          i++
        }

        let j = 0
        for(let key in this.contactsForm.value){
          createTrackFormData.append(`contacts[${j}][title]`, key);
          createTrackFormData.append(`contacts[${j}][value]`, this.contactsForm.value[key]);
          j++
        }
  
        this.formdataService.formdataAppendJson(createTrackFormData,currentForm)
        
  
        this.trackService.createTrack(createTrackFormData).pipe(
          catchError((err:serverError)=>{
            this.toastService.showToast('Возникла ошибка','danger')
            return EMPTY
          }),
          finalize(()=> this.loadingService.hideLoading())
        ).subscribe((res:any)=>{
          this.toastService.showToast('Трек успешно создан','success')
          this.navController.navigateRoot('/my-tracks')
        }) 
    }
   
  }

  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
  }

  cancelCreate(){
    this.navController.back()
  }
  setCoverage(event:any){
    this.coverageSelectedItem = event
  }

  ionViewWillEnter(){
    
  }

  ionViewDidLeave() {
    this.stepCurrency = 1
    this.createTrackForm.reset()
  }

  
  ngOnInit() {
    this.getRegions()
    window.addEventListener('popstate', (event) => {
      this.closeRegionModal()
  })
  }

}
