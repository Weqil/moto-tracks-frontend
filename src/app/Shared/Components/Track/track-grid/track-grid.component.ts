import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { IonInfiniteScroll } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TrackSectionComponent } from '../track-section/track-section.component';
@Component({
  selector: 'app-track-grid',
  templateUrl: './track-grid.component.html',
  styleUrls: ['./track-grid.component.scss'],
  imports: [IonInfiniteScroll,IonInfiniteScrollContent,CommonModule]
})
export class TrackGridComponent  implements OnInit {

  constructor() { }
  @Input() tracks: Track[] = [];
  @Input() spiner!: boolean
  @Input() stopScroll: boolean = false
  @Input() archived: boolean = false
  @Output() endScroll: EventEmitter<any> = new EventEmitter()
  @Input() notFound: any = false
  testTrack:Track = {
    id: 1,
    name: 'Баженово',
    address:'Свердловская область, поселок городского типа Белоярский, посёлок Баженово',
    latitude:56.728396,
    longitude:61.388896
  }
  onIonInfinite(event: any) {
    if (!this.notFound) {
      let trueEvent = event as InfiniteScrollCustomEvent
      this.endScroll.emit()
      trueEvent.target.complete()
    }
  }
  ngOnInit() {}

}
