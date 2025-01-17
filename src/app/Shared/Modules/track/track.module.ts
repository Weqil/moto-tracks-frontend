import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackSectionComponent } from '../../Components/Track/track-section/track-section.component';
import { TrackGridComponent } from '../../Components/Track/track-grid/track-grid.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackSectionComponent,
    TrackGridComponent
  ],
  exports: [TrackSectionComponent]
})
export class TrackModule { }
