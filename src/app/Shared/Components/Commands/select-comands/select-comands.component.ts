import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { CommandSectionComponent } from '../command-section/command-section.component';
import { FormsModule } from 'src/app/Shared/Modules/forms/forms.module';

@Component({
  selector: 'app-select-comands',
  templateUrl: './select-comands.component.html',
  styleUrls: ['./select-comands.component.scss'],
  imports: [IonModal,IonContent,CommonModule,CommandSectionComponent,FormsModule]
})
export class SelectComandsComponent  implements OnInit {

  constructor() { }
  @Input() commands: ICommand[] = []
  @Input() comandSelectModalStateValue: boolean = true
  @Output() openComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() closeComandSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() selectComand: EventEmitter<Track> = new EventEmitter();



  openModal(){
    this.openComandSelectModal.emit();
  }

  setComands(event:any){
    this.selectComand.emit(event);
  }

  closeModal(){
    this.closeComandSelectModal.emit();
  }
 
 
  ngOnInit() {}

}
