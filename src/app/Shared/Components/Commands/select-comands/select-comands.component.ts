import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonContent, IonModal, IonLabel, IonCheckbox, IonToggle } from '@ionic/angular/standalone';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { CommandSectionComponent } from '../command-section/command-section.component';
import { FormsModule } from '@angular/forms';
import { StandartButtonComponent } from "../../UI/Buttons/standart-button/standart-button.component";
import { StandartInputSearchComponent } from "../../Forms/standart-input-search/standart-input-search.component";
import { RoundedButtonComponent } from "../../UI/Buttons/rounded-button/rounded-button.component";

@Component({
  selector: 'app-select-comands',
  templateUrl: './select-comands.component.html',
  styleUrls: ['./select-comands.component.scss'],
  imports: [IonToggle, IonCheckbox, IonLabel, IonModal, IonContent, CommonModule, CommandSectionComponent, FormsModule, StandartButtonComponent, StandartInputSearchComponent, RoundedButtonComponent]
})
export class SelectComandsComponent  implements OnInit {

  constructor() { }
  @Input() commands: ICommand[] = []  
  @Input() selectedRegion?: {name:string, value:string}
  @Input() regions?: [{name:string, value:string}]|any
  @Input() comandSelectModalStateValue: boolean = true
  @Output() openComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() closeComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() selectComand: EventEmitter<Track> = new EventEmitter();
  @Output() createNewComand: EventEmitter<string> = new EventEmitter();
  @Output() setSelectedRegion: EventEmitter<any> = new EventEmitter();
  @Output() clearFilterRegion: EventEmitter<any> = new EventEmitter();

  createComandName: string = ''
  regionModalState:boolean = false
  sortComands:any = []
 
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
    this.createNewComand.emit(this.createComandName)
    this.sortComands = []
    this.clearSelectRegion()
    console.log(this.createComandName)
  }
 
 
  ngOnInit() {}

}
