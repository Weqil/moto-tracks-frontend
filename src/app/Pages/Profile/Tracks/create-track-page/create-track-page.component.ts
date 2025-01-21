import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { StepsModule } from 'src/app/Shared/Modules/steps/steps.module';
import { NavController } from '@ionic/angular/standalone';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';
import { EditSliderComponent } from 'src/app/Shared/Components/UI/edit-slider/edit-slider.component';
import { StandartRichInputComponent } from "../../../../Shared/Components/Forms/standart-rich-input/standart-rich-input.component";
import { IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { AddressInputComponent } from "../../../../Shared/Components/Forms/address-input/address-input.component";
@Component({
  selector: 'app-create-track-page',
  templateUrl: './create-track-page.component.html',
  styleUrls: ['./create-track-page.component.scss'],
  imports: [SharedModule, HeaderComponent, ButtonsModule, StepsModule, FormsModule, EditSliderComponent, StandartRichInputComponent, IonRadio, IonRadioGroup, AddressInputComponent]
})
export class CreateTrackPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)

  maxStepsCount: number = 3
  stepCurrency: number = 2
  newParams: [{temp_id:any, title:string, value:string}]|any = []
  createTrackForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    latitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    longitude: new FormControl('', [Validators.required, Validators.minLength(3)]),
    free: new FormControl('', [Validators.required, Validators.minLength(3)]),
    turns: new FormControl('', [Validators.required, Validators.minLength(3)]),
    length: new FormControl('', [Validators.required, Validators.minLength(3)]),
    desc: new FormControl('', [Validators.required, Validators.minLength(3)]),
    level: new FormControl('', [Validators.required, Validators.minLength(3)]),
    images: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })


  addNewParameter(){
    this.newParams.push({ temp_id: Date.now(), title: '', value: ''})
  }
  deleteNewParameter(temp_id: any){
    this.newParams = this.newParams.filter((param:any)=> param.temp_id !== temp_id);
  }

  stepInvalidate(){
    return true
  }
  stepPrevious() {
   
    if (this.stepCurrency > 1) {
      this.stepCurrency--
    }else{
      this.navController.back()
    }
  }
  stepNext() {
    if (this.stepCurrency <= this.maxStepsCount ) {
      this.stepCurrency++
    }
  }
  ngOnInit() {

  }

}
