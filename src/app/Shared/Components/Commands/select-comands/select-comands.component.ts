import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonContent, IonModal, IonLabel, IonCheckbox, IonToggle, NavController } from '@ionic/angular/standalone';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { CommandSectionComponent } from '../command-section/command-section.component';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { StandartButtonComponent } from "../../UI/Buttons/standart-button/standart-button.component";
import { StandartInputSearchComponent } from "../../Forms/standart-input-search/standart-input-search.component";
import { RoundedButtonComponent } from "../../UI/Buttons/rounded-button/rounded-button.component";
import { StandartInputComponent } from "../../Forms/standart-input/standart-input.component";
import { CircleButtonComponent } from "../../UI/Buttons/circle-button/circle-button.component";
import { HeaderComponent } from "../../UI/header/header.component";
import { BackButtonComponent } from "../../UI/LinarikUI/buttons/back-button/back-button.component";
import { RegionsSelectModalComponent } from "../../Modals/regions-select-modal/regions-select-modal.component";
import { IconButtonComponent } from "../../UI/LinarikUI/buttons/icon-button/icon-button.component";

@Component({
  selector: 'app-select-comands',
  templateUrl: './select-comands.component.html',
  styleUrls: ['./select-comands.component.scss'],
  imports: [IonToggle, IonCheckbox, IonLabel, IonModal, IonContent, CommonModule, CommandSectionComponent, FormsModule, StandartButtonComponent, StandartInputSearchComponent, RoundedButtonComponent, StandartInputComponent, CircleButtonComponent, HeaderComponent, BackButtonComponent, RegionsSelectModalComponent, IconButtonComponent]
})
export class SelectComandsComponent  implements OnInit {

  constructor() { }
  @Input() commands: ICommand[] = []
  @Input() selectedRegion?: {name:string, value:string}
  @Input() fullWidth: boolean = false
  @Input() regions?: [{name:string, value:string}]|any
  @Input() createRegions?: [{name:string, value:string}]|any
  @Input() comandSelectModalStateValue: boolean = true
  @Output() openComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() closeComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() selectComand: EventEmitter<Track> = new EventEmitter();
  @Output() createNewComand: EventEmitter<any> = new EventEmitter();
  @Output() setSelectedRegion: EventEmitter<any> = new EventEmitter();
  @Output() clearFilterRegion: EventEmitter<any> = new EventEmitter();

  createComandForm: FormGroup = new FormGroup(
      {
        id: new FormControl('',[Validators.required]),
        name: new FormControl('',[Validators.required]), //сокращенное имя
        region: new FormControl('',[Validators.required]), //регион
        city: new FormControl('',[Validators.required]), //город
        locationId: new FormControl('',[Validators.required]),
      }
    )

    close(){
      this.comandSelectModalStateValue = false
    }


  visibleCreateCommandContainerValue: boolean = false
  locationId: string = ''
  regionModalState:boolean = false
  sortComands:any = []
  createComandsModalState: boolean = false
  navControler:NavController = inject(NavController)
  createRegionModalState: boolean = false

  visible(){
    this.visibleCreateCommandContainerValue = true
  }
  nonVisible(){
      this.visibleCreateCommandContainerValue = false
  }

  openCreateComandsModalState(){
    this.createComandsModalState = true
  }
  closeCreateComandsModalState(){
    this.createComandsModalState = false
  }

  ngOnChanges(){
      if(this.commands && this.selectedRegion?.value){
        this.sortComands = this.commands.filter((comand:ICommand)=> !comand.id || comand.location?.id === Number(this.selectedRegion?.value))
      }
      else
      {
        this.sortComands = []
      }
  }

  setRegion(region:any){
    this.closeRegionModal()
    this.setSelectedRegion.emit(region)
  }

  setCreateRegion(region:any){

    this.closeCreateRegionModal()
    this.locationId = region.value
    this.createComandForm.patchValue({region:region.name})
    this.createComandForm.patchValue({locationId:region.value})

  }

  openModal(){
    this.openComandSelectModal.emit();
  }

  setComands(event:any){
    this.selectComand.emit(event);
  }

  closeModal(){
    this.closeComandSelectModal.emit();
  }

  closeRegionModal(){
    this.regionModalState = false
  }
  openRegionModal(){
    this.regionModalState = true
  }
  clearSelectRegion(){
    this.clearFilterRegion.emit()
  }

  createComandFunction(){

    this.createNewComand.emit(this.createComandForm.value)
    this.sortComands = []
    this.clearSelectRegion()

    this.createComandForm.reset();


  }

  closeCreateRegionModal(){
    this.createRegionModalState = false
  }
  openCreateRegionModal(){
    this.createRegionModalState = true
  }


  ngOnInit() {}

}
