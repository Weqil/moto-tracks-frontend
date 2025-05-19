import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonModal, NavController } from '@ionic/angular/standalone';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FileInputComponent } from 'src/app/Shared/Components/Forms/file-input/file-input.component';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { formdataService } from 'src/app/Shared/Helpers/formdata.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { StandartInputComponent } from "../../../../Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component";
import { IconButtonComponent } from "../../../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import { RegionsSelectModalComponent } from "../../../../Shared/Components/Modals/regions-select-modal/regions-select-modal.component";

@Component({
  selector: 'app-edit-comand-page',
  templateUrl: './edit-comand-page.component.html',
  styleUrls: ['./edit-comand-page.component.scss'],
  imports: [IonContent, HeaderComponent, FileInputComponent, StandartButtonComponent, CommonModule, IonModal, StandartInputSearchComponent, CheckImgUrlPipe, StandartInputComponent, IconButtonComponent, RegionsSelectModalComponent]
})
export class EditComandPageComponent  implements OnInit {

  constructor() { }
   comandService:ComandsService = inject(ComandsService)
   navController: NavController = inject(NavController)
  
   toastService: ToastService = inject(ToastService)
  
   loaderService:LoadingService = inject(LoadingService)
   formdataService:formdataService = inject(formdataService)

   commandId:string = ''

   private readonly destroy$ = new Subject<void>()

   mapService:MapService = inject(MapService)

   searchRegionItems:any[] = []

   route: ActivatedRoute = inject(ActivatedRoute)

   avatarUrl:string = '/assets/icons/team-bg.png';
   checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)
   avatar!:File
   regionModalState: boolean = false;

   command!:ICommand

   formErrors:any = {
      name: {
        errorMessage:''
        },
      fullName: {
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
   }

   createCommandForm: FormGroup = new FormGroup({
         name: new FormControl('', [Validators.required, Validators.minLength(3)]),
         fullName: new FormControl(),
         city: new FormControl('', [Validators.required, Validators.minLength(3)]),
         region: new FormControl('', [Validators.required, Validators.minLength(3)]),
         locationId: new FormControl('', [Validators.required, Validators.minLength(3)]),
   })
   
   
   getCommand(){
    this.comandService.getCommandById(Number(this.commandId)).pipe().subscribe((res:any)=>{
      this.createCommandForm.patchValue({
        ...res.command,
        locationId: res.command.location.id,
        region: `${res.command.location.name} ${res.command.location.type}`,
      })
      this.avatarUrl = res.command.avatar ? this.checkImgUrlPipe.checkUrlDontType((res.command.avatar)) : '/assets/icons/team-bg.png'
    })
   }
   closeRegionModal(){
    this.regionModalState = false
  }

   openRegionModal(){
    this.regionModalState = true
   }
   back(){
    this.navController.back()
   }
   setRegion(region:any){
    this.closeRegionModal()
    this.createCommandForm.patchValue({region:region.name})
    this.createCommandForm.patchValue({locationId:region.value})
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
  setAvatarFile(event:any){
    this.avatar = event.target.files[0]
    let reader = new FileReader()
    reader.onload = (e:any) => {
      this.avatarUrl = e.target.result as string
    }
    reader.readAsDataURL( this.avatar)
  }

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
        this.comandService.editComand(formData,this.commandId).pipe(
            finalize(()=>{
              this.loaderService.hideLoading(loader)
            })
          ).subscribe((res:any)=>{
            this.toastService.showToast('Команда успешно изменена','success')
            setTimeout(()=>{
              this.navController.back()
            },500)
          })
    
        } else {
         
        }
  }

  ionViewWillEnter(){
     this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          this.commandId = params['id']
          this.getCommand()
          this.getRegions()
      })
  }
  ngOnInit() {

  }

}
