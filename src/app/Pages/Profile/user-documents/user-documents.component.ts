import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { IonModal } from '@ionic/angular/standalone';
import { catchError, EMPTY, finalize } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { NavController } from '@ionic/angular/standalone';
import { serverError } from 'src/app/Shared/Data/Interfaces/errors';
import { StandartInputSelectComponent } from 'src/app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component';
import cloneDeep from 'lodash/cloneDeep';
import _ from 'lodash';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { formdataService } from 'src/app/Shared/Helpers/formdata.service';
import moment from 'moment';


@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.scss'],
  imports: [SharedModule,HeaderModule,FormsModule,StandartInputSelectComponent,IonModal]
})
export class UserDocumentsComponent  implements OnInit {
  navController:NavController = inject(NavController)
  constructor() { }
  oldLicensesValue?: any
  oldPolisValue?: any
  loaderService:LoadingService = inject(LoadingService)
  
  oldPasportValue?:{id:number,data:{numberAndSeria:string, fileLink:string}} 
  httpClient:HttpClient = inject(HttpClient)
  userService:UserService = inject(UserService)
  toastService:ToastService = inject(ToastService)
  formdataService:formdataService = inject(formdataService)

  regionModalState:boolean = false

  licensesFile:any =''
  polisFile:any = ''
  notariusFile:any = ''

  mapService:MapService = inject(MapService)

  searchRegionItems:any[] = []

  oldNotariusFile:any
  oldNotariusValue:any
  oldPolisFile:any
  
  licensesForm: FormGroup = new FormGroup(
    {
      number: new FormControl('',[Validators.required, Validators.minLength(1), ]), //номер лицензии
    }
  )

  polisForm: FormGroup = new FormGroup(
    {
      number: new FormControl('',[Validators.required]), //Серия и номер полиса
      issuedWhom: new FormControl('',[Validators.required]), //Кем выдан
      itWorksDate: new FormControl('',[Validators.required]), //Срок действия
    }
  )

  notariusForm:FormGroup = new FormGroup (
    {
      notariusFile: new FormControl('',[Validators.required,]), // путь до файла
    }
  )

  pasportForm: FormGroup = new FormGroup(
    {
      numberAndSeria: new FormControl('',[Validators.required, Validators.minLength(1)]), //Серия и номер полиса
      pasportFileLink: new FormControl(''), // путь до файла
    }
  )

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
    startNumber: {
       errorMessage:''
      },
  }

  engineItems:{name:string, value:string}[] = [
    {name:'2Т', value:'2Т'},
    {name:'4Т', value:'4Т'},
  ]

  sportRankItems:{name:string, value:string}[] = [
    {name:'МСМК', value:'МСМК'},
    {name:'МС', value:'МС'},
    {name:'КМС', value:'КМС'},
    {name:'I', value:'I'},
    {name:'II', value:'II'},
    {name:'III', value:'III'},
    {name:'Iю', value:'Iю'},
    {name:'IIю', value:'IIю'},
    {name:'IIIю', value:'IIIю'},
    {name:'б/р', value:'б/р'},
  ]

  motoStampItems: {name:string, value:string}[] = [
    {name:'Kaw', value:'Kaw'},
    {name:'KTM', value:'KTM'},
    {name:'Yam', value:'Yam'},
    {name:'Gas-Gas', value:'Gas-Gas'},
    {name:'Hon', value:'Hon'},
    {name:'BSE', value:'BSE'},
    {name:'Husq', value:'Husq'},
    {name:'Kayo', value:'Kayo'},
    {name:'Fantic', value:'Fantic'},
    {name:'Урал',value:'Урал'},
    {name:'Zabel', value:'Zabel'},
    {name:'MTX', value:'MTX'},
    {name:'TRIUMPH', value:'TRIUMPH'},
    {name:'Другое', value:'Другое'}
  ]

  personalUserForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    patronymic: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    locationId: new FormControl('', [Validators.required]),
    snils: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    startNumber: new FormControl('', [Validators.required]),
    group:new FormControl('', [Validators.required]),
    rank:new FormControl('', [Validators.required]),
    rankNumber:new FormControl('', [Validators.required]),
    community:new FormControl('', [Validators.required]),
    coach:new FormControl('', [Validators.required]),
    motoStamp:new FormControl('', [Validators.required]),
    engine:new FormControl('', [Validators.required]),
    numberAndSeria:new FormControl('', [Validators.required]),
  })

submitValidate(){
  let valid = true
  Object.keys(this.personalUserForm.controls).forEach((key) => {
    const control = this.personalUserForm.get(key); // Доступ к контролу
    if (!control!.valid) {
      if(this.formErrors[key]){
        this.formErrors[key].errorMessage = 'Обязательное поле'; // Сообщение об ошибке
         valid = false
      }
    } else {
        if( this.formErrors[key]){
          this.formErrors[key].errorMessage = ''; // Очистка сообщения об ошибке
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

setEngine(event:any){
  this.personalUserForm.patchValue({engine: event.name})
}

setRank(event:any){
  this.personalUserForm.patchValue({rank: event.name})
}

setMotoStamp(event:any){
  this.personalUserForm.patchValue({motoStamp: event.name})
}

submitForm(){

  if(this.submitValidate()){
    console.log(this.personalUserForm.value)
    if(!this.oldLicensesValue && this.validateLicenses()){
      this.createLicenses()
    }
    
    if(!this.oldPolisValue && this.validatePolis()){
      this.createPolis()
    }
    
    if(!this.oldNotariusValue && this.validateNotarius()){
      this.createNotarius()
    }
  
    if(this.oldLicensesValue && this.validateLicenses()){
  
      let oldLicensesValue:any = this.oldLicensesValue
      if(!_.isEqual(oldLicensesValue,this.licensesForm.value) || !this.licensesFile.dontFile){
     
        this.updateLicenses()
      }
    }
  
    if(this.oldPolisValue && this.validatePolis()){
      let oldPolisValue:any = this.oldPolisValue
      if(!_.isEqual(oldPolisValue,this.polisForm.value) || !this.polisFile.dontFile ){
        this.updatePolis()
      }
    }
    if(this.oldNotariusFile){
      this.updateNotarius()
    }

    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    if(this.userService.user.value?.personal){
      this.userService.updatePersonalInfo(this.personalUserForm.value).pipe(
        finalize(
          ()=>{
            this.loaderService.hideLoading(loader)
          }
        )
      ).subscribe((res:any)=>{
        this.toastService.showToast('Данные успешно изменены', 'success')
        this.userService.refreshUser()
        this.navController.back();
      })
    }else{
        this.userService.createPersonalInfo(this.personalUserForm.value).pipe(
          finalize(
            ()=>{
              this.loaderService.hideLoading()
            })
        ).subscribe((res:any)=>{
          this.toastService.showToast('Данные успешно добавлены', 'success')
          this.userService.refreshUser()
          this.navController.back();
        })
    }
  }else{
    this.toastService.showToast('Заполните обязательные поля - Фамилия, имя, область, спортивное звание,','danger')
  }
}

  cancelEdit(){
    this.navController.back()
  }

  checkFormInDublicatsOldValue(form: FormGroup, oldValue: any) {
    let dublicates: boolean = false;
  
    for (let key in form.value) {
      if (form.value[key] === oldValue[key]) {
        dublicates = true;
        break;
      }
    }
  
    return dublicates;
  }

  validateLicenses(){
    if(this.licensesForm.valid){
      return true
    }else{
      return false
    }
  }
  validatePolis(){ 
    if(this.polisForm.valid){
      return true
    }else{
      return false
    }
  }
  validatePasport(){
    if(this.pasportForm.valid ){
      return true
    }else{
      return false
    }
  }

  createLicenses(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    let fd:FormData = new FormData()
    fd = this.formdataService.formdataAppendJson(fd,this.licensesForm.value)
    fd.append('type','licenses')
    fd.append('file',this.licensesFile)

    this.userService.createUserDocument(fd).pipe(
    finalize(()=>{
      this.loaderService.hideLoading(loader)
    }),
    catchError((err:serverError)=>{
      this.toastService.showToast(err.error.message,'danger')
      return EMPTY
    })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные лицензии успешно сохранены','success')
      this.setFormValue()
    })
  }

  setPolisFile(event:any){
    let file = event.target.files[0]
    this.polisFile = file
    console.log(this.polisFile)
  }

  setLicensesFile(event:any){
    let file = event.target.files[0]
    this.licensesFile = file
  }

  setNotariusFile(event:any){
    let file = event.target.files[0]
    this.notariusFile = file
  }
  
  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
  }

  createPasport(){
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
        loader = res
      })
      this.userService.createUserDocument({type: 'pasport', data:(this.pasportForm.value)}).pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные паспорте успешно сохранены','success')
      this.setFormValue()
    })
  }

  createPolis(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
     let fd: FormData = new FormData()
     fd.append('type','polis')
     fd = this.formdataService.formdataAppendJson(fd,this.polisForm.value)
     fd.append('file',this.polisFile)
      this.userService.createUserDocument(fd).pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные полиса успешно сохранены','success')
      this.setFormValue()
    })
  }

  updateLicenses(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    let fd:FormData = new FormData()
    fd = this.formdataService.formdataAppendJson(fd,this.licensesForm.value)
  
    if(!this.licensesFile.dontFile){
      fd.append('file',this.licensesFile)
    }
    this.userService.updateDocument(Number(this.oldLicensesValue?.id), fd).pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные лицензии успешно обновлены','success')
    })
  }


  updatePolis(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    let fd:FormData = new FormData()
    fd = this.formdataService.formdataAppendJson(fd,this.polisForm.value)
    if(!this.polisFile.dontFile){
      fd.append('file',this.polisFile)
    }
    this.userService.updateDocument(Number(this.oldPolisValue?.id),fd).pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      this.toastService.showToast('Данные полиса успешно обновлены','success')
    })
  }

  updateNotarius(){
    if(this.validateNotarius()){
      let loader:HTMLIonLoadingElement
      this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
        loader = res
      })
      let fd: FormData = new FormData()
      if(!this.notariusFile.dontFile){
        fd.append('file',this.notariusFile)
        this.userService.updateDocument(Number(this.oldNotariusValue?.id),fd).pipe(
          finalize(()=>{
            this.loaderService.hideLoading(loader)
          })
        ).subscribe((res:any)=>{
          this.toastService.showToast('Данные удостоверения успешно обновлены','success')
        })
      }
      
    }
  
  }

  validateNotarius(){
    if(this.notariusFile && !this.notariusFile.dontFile){
      return true
    } else{
      return false
    }
  }

  createNotarius(){
    if(this.validateNotarius()){
        let loader:HTMLIonLoadingElement
       this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
        loader = res
       })

      let fd: FormData = new FormData()
      fd.append('type','notarius')
      fd.append('file',this.notariusFile)
       this.userService.createUserDocument(fd).pipe(
       finalize(()=>{
         this.loaderService.hideLoading(loader)
       })
     ).subscribe((res:any)=>{
       this.toastService.showToast('Данные успешно сохранены','success')
       this.setFormValue()
     })
    }
   
  }

  setFormValue(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    this.userService.getUserDocuments().pipe(
      finalize(()=>{
        this.loaderService.hideLoading(loader)
      })
    ).subscribe((res:any)=>{
      if(res.documents){
        console.log(res.documents)
        if(res.documents.find((doc:any)=> doc.type === 'licenses')){
          let licensesDocument = res.documents.find((doc:any)=> doc.type === 'licenses')
          this.licensesForm.patchValue((res.documents.find((doc:any)=> doc.type === 'licenses')))
          this.licensesFile = {name:'Лицензия загружена', dontFile:true} 
        }
        if((res.documents.find((doc:any)=> doc.type === 'polis'))){
          let polis = (res.documents.find((doc:any)=> doc.type === 'polis'))
          this.polisForm.patchValue({
            number: polis.number,
            issuedWhom: polis.issued_whom,
            itWorksDate: moment(polis.it_works_date).format('YYYY-MM-DD')
          })
          this.polisFile = {name:'Полис загружен', dontFile:true}
        }
        if(res.documents.find((doc:any)=> doc.type === 'pasport')){
          this.pasportForm.patchValue((res.documents.find((doc:any)=> doc.type === 'pasport')))
        } 
        if(res.documents.find((doc:any)=> doc.type === 'notarius')){
          this.notariusFile = {name:'Согласие загружено', dontFile:true}
          this.oldNotariusFile = {name:'Согласие загружено', dontFile:true}
        } 

      
        this.oldLicensesValue = (res.documents.find((doc:any)=> doc.type === 'licenses'))
        this.oldPolisValue = (res.documents.find((doc:any)=> doc.type === 'polis'))
        this.oldNotariusValue = (res.documents.find((doc:any)=> doc.type === 'notarius'))
        this.oldPasportValue = (res.documents.find((doc:any)=> doc.type === 'pasport'))
      }
     
    })
  }

  setRegion(region:any){
    this.closeRegionModal()
    this.personalUserForm.patchValue({locationId:region.value,region:region.name})
  }

  ionViewWillEnter(){
    this.setFormValue()
    this.getRegions()
    this.userService.refreshUser()
    if(this.userService.user.value?.personal){
      this.personalUserForm.patchValue(this.userService.user.value?.personal)
      this.personalUserForm.patchValue({
        dateOfBirth: this.userService.user.value?.personal.date_of_birth,
        phoneNumber: this.userService.user.value?.personal.phone_number,
        startNumber: this.userService.user.value?.personal.start_number,
        rankNumber: this.userService.user.value?.personal.rank_number,
        motoStamp:  this.userService.user.value?.personal.moto_stamp,
        numberAndSeria: this.userService.user.value?.personal.number_and_seria
      })
    }else{
      this.personalUserForm.reset()
    }
  }

  ngOnInit() {}

}
