import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onClose:EventEmitter<any> = new EventEmitter()
  regionSearchForm = new FormGroup({
      text: new FormControl(),
      searchRegion: new FormControl(),
  })
  closeRegionModal(){
    this.onClose.emit()
  }

  ngOnInit() {}

}
