import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackSectionComponent } from '../../Components/Track/track-section/track-section.component';
import { TrackGridComponent } from '../../Components/Track/track-grid/track-grid.component';
import { TrackSelectModalComponent } from '../../Components/Track/track-select-modal/track-select-modal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackSectionComponent,
    TrackGridComponent,
    TrackSelectModalComponent
  ],
  exports: [TrackSectionComponent,TrackSelectModalComponent]
})
export class TrackModule { }
