import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonModal, NavController } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { formdataService } from 'src/app/Shared/Helpers/formdata.service';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';

@Component({
  selector: 'app-create-comand-page',
  templateUrl: './create-comand-page.component.html',
  styleUrls: ['./create-comand-page.component.scss'],
  imports: [IonContent,HeaderComponent,FormsModule,IonModal,CommonModule,StandartButtonComponent],
})
export class CreateComandPageComponent  implements OnInit {

  constructor() { }

  avatar!:File
  
  regionModalState: boolean = false;
  avatarUrl:string = '/assets/icons/team-bg.png';
  mapService:MapService = inject(MapService)

  comandService:ComandsService = inject(ComandsService)
  navController: NavController = inject(NavController)

  toastService: ToastService = inject(ToastService)

  loaderService:LoadingService = inject(LoadingService)
  formdataService:formdataService = inject(formdataService)

  searchRegionItems:any[] = []

  locationId!:string

  formErrors:any = {
    name: {
      errorMessage:''

      },
    surname: {
       errorMessage:''
      },
    city: {
       errorMessage:''
      },
    region:{
        errorMessage:''
    },
    fullName:{
      errorMessage:''
  },
  }

  createCommandForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      city: new FormControl('', [Validators.required, Validators.minLength(3)]),
      region: new FormControl('', [Validators.required, Validators.minLength(3)]),
      locationId: new FormControl('', [Validators.required, Validators.minLength(3)]),

   })

   submitValidate(){
    let valid = true
    Object.keys(this.createCommandForm.controls).forEach((key) => {
      const control = this.createCommandForm.get(key); 
      if (!control!.valid) {
        if(this.formErrors[key]){
          this.formErrors[key].errorMessage = 'Обязательное поле'; 
           valid = false
        }
      } else {
          if( this.formErrors[key]){
            this.formErrors[key].errorMessage = ''; 
          }
      }
    });
    return valid
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
    this.createCommandForm.patchValue({region:region.name})
    this.createCommandForm.patchValue({locationId:region.value})
  }

  setAvatarFile(event:any){
    this.avatar = event.target.files[0]
    let reader = new FileReader()
    reader.onload = (e:any) => {
      this.avatarUrl = e.target.result as string
    }
    reader.readAsDataURL( this.avatar)
  }

  onSubmit(){
    if(this.submitValidate()){
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
        loader = res
      })
      let formData = new FormData()
      this.formdataService.formdataAppendJson(formData, this.createCommandForm.value)
      if(this.avatar){
        formData.append('avatar', this.avatar)
      }
      this.comandService.createComand(formData).pipe(
        finalize(()=>{
          this.loaderService.hideLoading(loader)
        })
      ).subscribe((res:any)=>{
        this.toastService.showToast('Команда успешно создана','success')
        this.navController.back()
      })
    


    } else {
     
    }
  }

  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
  }

  ngOnInit() {
    this.getRegions()
  }

}
