import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonModal } from '@ionic/angular/standalone';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { NavController } from '@ionic/angular/standalone';
import { IconButtonComponent } from '../../UI/LinarikUI/buttons/icon-button/icon-button.component';
import { HeaderComponent } from '../../UI/header/header.component';


@Component({
  selector: 'app-track-select-modal',
  templateUrl: './track-select-modal.component.html',
  styleUrls: ['./track-select-modal.component.scss'],
  imports:[CommonModule, TrackModule, IonModal,SharedModule,IconButtonComponent,HeaderComponent]
})

export class TrackSelectModalComponent  implements OnInit {
 
  constructor() { }

  @Input() selectedTrack?: Track 
  @Input() tracks: Track[] = []
  @Input() trackSelectModalStateValue: boolean = false
  @Output() openTrackSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() closeTrackSelectModal: EventEmitter<any> = new EventEmitter();
  @Output() selectTrack: EventEmitter<Track> = new EventEmitter();
  navController: NavController = inject(NavController)

  redirectInCreate(){
    this.navController.navigateRoot('/create-track')
    this.closeTrackSelectModal.emit();
  }

  openModal(){
    this.openTrackSelectModal.emit();
  }
  closeModal(){
    this.closeTrackSelectModal.emit();
  }
  ngOnChanges(){
  
  }
  back(){
    this.closeTrackSelectModal.emit();
  }
 
  select(event:Track){
    this.selectTrack.emit(event);
  }
  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closeModal()
      
  })
  }

}
