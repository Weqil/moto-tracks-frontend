import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectBottomModalComponent } from '../../UI/LinarikUI/select-bottom-modal/select-bottom-modal.component';

import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component';
import { StandartInputComponent } from '../../UI/LinarikUI/forms/standart-input/standart-input.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-regions-select-modal',
  templateUrl: './regions-select-modal.component.html',
  styleUrls: ['./regions-select-modal.component.scss'],
  imports:[
    SelectBottomModalComponent,
    StandartInputComponent,
    IconButtonComponent,CommonModule
  ]
})
export class RegionsSelectModalComponent  implements OnInit {

  @Input() visibleSearch:boolean = true

  constructor() { }
   /**
   * Регионы 
   */

  @Input() regions:[
   {
     name:string,
     value:any
   }
  ]|any[] = []

  @Input() visible:boolean = false

   /**
   * Имя выбраного региона
   */

  @Input() selectedRegion:string = ''
     /**
   * Отправка выбраного региона
   */

  @Output() select:EventEmitter<any> = new EventEmitter()

  @Output() onClose:EventEmitter<any> = new EventEmitter()

  selectedRegionInModal:any = {}

  searchItems:[
    {
      name:string,
      value:any
    }
   ]|any[] = []

  regionSearchForm = new FormGroup({
      searchRegion: new FormControl(),
  })
   /**
   * Буфер для сохранения региона
   */
  tempRegionStorage:any = {
     name:'Россия',
      value:''
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchItems = this.regions
  }

  searchInputChange(event:any) {
    this.search()
  }
  
  search() {
    this.searchItems = this.regions.filter(item => item.name.toLowerCase().includes(this.regionSearchForm.value.searchRegion.toLowerCase()))
  }

  selectRegion(region:{name:string,value:any})
  {
    this.selectedRegion = region.name
    this.tempRegionStorage = region
  }

  saveRegionInFilter(){
    this.select.emit(this.tempRegionStorage)
  }

  clearAllRegion(){
    this.select.emit({
      name:'Россия',
      value:''
    })
    
  }

  closeRegionModal(){
    this.onClose.emit()
    this.regionSearchForm.reset()
  }

  ngOnInit() {}

}
