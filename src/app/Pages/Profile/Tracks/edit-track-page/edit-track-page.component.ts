import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonModal, IonToggle, NavController } from '@ionic/angular/standalone';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { AddressInputComponent } from 'src/app/Shared/Components/Forms/address-input/address-input.component';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { StandartRichInputComponent } from 'src/app/Shared/Components/Forms/standart-rich-input/standart-rich-input.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import * as _ from 'lodash';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { InfoPopoverComponent } from 'src/app/Shared/Components/UI/info-popover/info-popover.component';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';

@Component({
  selector: 'app-edit-track-page',
  templateUrl: './edit-track-page.component.html',
  styleUrls: ['./edit-track-page.component.scss'],
  imports:[SharedModule,StandartInputComponent,
     HeaderComponent, StandartRichInputComponent,IonModal,StandartInputSearchComponent,AddressInputComponent,EditSliderComponent,
    StandartButtonComponent,InfoPopoverComponent,IonToggle,StandartInputSelectComponent]
})
export class EditTrackPageComponent  implements OnInit {

  constructor() { }

  route: ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  trackService: TrackService = inject(TrackService)
  loadingService: LoadingService = inject(LoadingService)
  toastService: ToastService = inject(ToastService)

  mapService:MapService = inject(MapService)
  locationId:string = ''
  sliderImages:any = []
  regionModalState:boolean = false
  searchRegionItems:any[] = []

  backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`

  deletesImages:any[] = []
  navController: NavController = inject(NavController)
  checkImgUrlPipe: CheckImgUrlPipe = inject(CheckImgUrlPipe)

  track!:Track
  trackId!: string 

  coverageSelectedItem:any =  {name:'hard', value:'hard'}

  logoUrl:string = ''
  schemeUrl:string = ''

  editTrackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    latitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    longitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    free: new FormControl(1, [Validators.required, Validators.minLength(3)]),
    turns: new FormControl('', [Validators.required, Validators.minLength(3)]),
    light: new FormControl(false, [Validators.required,]),
    allSeazonal: new FormControl(false, [Validators.required,]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
    region: new FormControl('', [Validators.required, Validators.minLength(3)]),
    logo: new FormControl('', [Validators.required,]),
    schemaImg: new FormControl('', [Validators.required,]),
    locationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
    length: new FormControl('', [Validators.required, Validators.minLength(3)]),
    level: new FormControl('', [Validators.required, Validators.minLength(3)]),
    images: new FormControl('', [Validators.required, Validators.minLength(3)]),
    is_work: new FormControl(1),
 })

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

coverageItems:any[] = [
  {name:'mid-hard', value:'mid-hard'},
  {name:'hard', value:'hard'},
  {name:'mid-soft', value:'mid-soft'},
  {name:'soft', value:'soft'},
]

setCoverage(event:any){
  this.coverageSelectedItem = event
}


  getTrack(){
    this.loadingService.showLoading()
    this.trackService.getTrackById(this.trackId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()
      })
    ).subscribe((res:any)=>{
        this.track = res.track
        this.locationId = res.track?.location?.id
        this.logoUrl = this.checkImgUrlPipe.checkUrlDontType(res.track?.logo)
        this.schemeUrl = this.checkImgUrlPipe.checkUrlDontType(res.track?.schema_img)
        this.editTrackForm.patchValue({
          ...this.track,
            locationId: res.track?.location?.id,
            images: this.track.images? this.track.images?.map((image:string)=>{ return {
            link:this.checkImgUrlPipe.checkUrlDontType(image),
            name:`${crypto.randomUUID()}`
           }}):[],
           region: `${ this.track?.location?.name} ${this.track?.location?.type}`,
        })
        this.track.spec?.forEach((specItem:any)=>{
          this.specForm.patchValue({
            [specItem.title]: specItem.value
          })
        })
        this.track.contacts?.forEach((contactItem:any)=>{
          this.contactsForm.patchValue({
            [contactItem.title]: contactItem.value
          })
        })
        console.log( this.editTrackForm.value)
        this.editTrackForm.patchValue({
          desc: this.track.desc ? this.track.desc!.replace(/  /g, '&nbsp;&nbsp;') : ''
        });
        this.sliderImages = this.editTrackForm.value.images
    })
  }

  setLogo(event:any, input:HTMLInputElement){
    const file = event.target.files[0]
    if(file){
      this.editTrackForm.patchValue({ logo: file })
      const reader: FileReader = new FileReader()
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result
      }
      reader.readAsDataURL(file)
      input.value =''
    }
  }
  setScheme(event:any,input:HTMLInputElement){
    const file = event.target.files[0]
    if(file){
      this.editTrackForm.patchValue({ schemaImg: file })
      const reader: FileReader = new FileReader()
      reader.onload = (e: any) => {
        this.schemeUrl = e.target.result
      }
      reader.readAsDataURL(file)
      input.value =''
    }
  }
  clearLogo(){
    this.logoUrl = ''
    this.editTrackForm.patchValue({logo: ''})
  }

  setRegion(region:any){
    this.closeRegionModal()
    this.locationId = region.value
    this.editTrackForm.patchValue({region:region.name})
    this.editTrackForm.patchValue({locationId:region.value})
  }

  changeAddress(event:any){
    if(event.latitude && event.longitude){
      this.editTrackForm.patchValue({
        latitude: event.latitude,
        longitude: event.longitude,
        address: event.address
      })
    }
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
    this.editTrackForm.patchValue({
      images: event
    })
  }

  submitForm(){
    if(!this.stepInvalidate()){
      this.loadingService.showLoading()
      this.specForm.patchValue({coverage: this.coverageSelectedItem.value})
      this.editTrackForm.patchValue({light: Number(this.editTrackForm.value.light), allSeazonal:Number(this.editTrackForm.value.allSeazonal)})
      this.editTrackForm.value.images = this.editTrackForm.value.images.filter((image:any)=>!image.link)
      let editForm = {
          ...this.editTrackForm.value,
          free:1,
          is_work:1,
          imagesAdd: _.cloneDeep(this.editTrackForm.value.images),
          imagesDel: this.deletesImages.map((image:string)=>image.split(`${this.backendUrl}/storage/`)[1])
      }
   
      let editEventFormData:FormData = new FormData()
      for (let key in editForm) {
        if (Array.isArray(editForm[key])) {
            editForm[key].forEach((item, index) => {
                editEventFormData.append(`${key}[${index}]`, item);
           })
        } 
        else {
            editEventFormData.append(key, editForm[key] !== null ? editForm[key] : '')
        }
      }
      if(typeof this.editTrackForm.value.logo == 'string'){
        editEventFormData.delete('logo');
      }
      if(typeof this.editTrackForm.value.schemaImg =='string'){
        editEventFormData.delete('schemaImg');
      }

      let i = 0
      for(let key in this.specForm.value){
        editEventFormData.append(`spec[${i}][title]`, key);
        editEventFormData.append(`spec[${i}][value]`, this.specForm.value[key]);
        i++
      }

      let j = 0
      for(let key in this.contactsForm.value){
        editEventFormData.append(`contacts[${j}][title]`, key);
        editEventFormData.append(`contacts[${j}][value]`, this.contactsForm.value[key]);
        j++
      
    }
      
      this.trackService.updateTrack(editEventFormData, this.trackId).pipe(
        finalize(()=>{
          this.loadingService.hideLoading()
        }),
        catchError((error: any) => {
          this.toastService.showToast('Ошибка при изменении события', 'danger')
          this.navController.back()
          console.error(error)
          return EMPTY
        })
      ).subscribe((res:any)=>{
        this.toastService.showToast('Событие успешно изменено','success')
        this.navController.back()
      })
    }
    
  }

  stepInvalidate(){
    if (
      this.editTrackForm.value.name.length <= 3 ||
      !this.editTrackForm.value.locationId || 
      !this.editTrackForm.value.address.length ||
      !this.editTrackForm.value.latitude || 
      !this.editTrackForm.value.longitude || 
      !this.locationId || !this.logoUrl || !this.specForm.valid
    ) {
      return true
    } 
    else {
      return false
    }
  }

  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
  }

  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.trackId = params['id']
      this.getTrack()
      this.getRegions()
    })
  }

  ngOnInit() {

    window.addEventListener('popstate', (event) => {
      
      this.closeRegionModal()
  })

   
  }

}
