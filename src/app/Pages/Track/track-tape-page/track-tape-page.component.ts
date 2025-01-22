import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { RouterLink } from '@angular/router';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { TrackTapeService } from 'src/app/Shared/Data/Services/Track/track-tape.service';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-track-tape-page',
  templateUrl: './track-tape-page.component.html',
  styleUrls: ['./track-tape-page.component.scss'],
  imports: [SharedModule, HeaderModule, ButtonsModule, TrackModule, RouterLink]
})

export class TrackTapePageComponent  implements OnInit {

  constructor() { }
  private readonly destroy$ = new Subject<void>()
  navController: NavController = inject(NavController)

  trackService:TrackService = inject(TrackService)
  trackTapeService:TrackTapeService = inject(TrackTapeService)

  @ViewChild(IonContent) ionContent!: IonContent

  getTracks(){
    this.trackService.getTracks().pipe().subscribe((res:any)=>{
      this.trackTapeService.tracks = res.tracks
    })
  }

  redirectInEvents(){
    this.navController.navigateForward('/events')
  }

  ionViewWillEnter(){
    this.ionContent.scrollToPoint(0, this.trackTapeService.tracksLastScrollPositionForTape, 0)
    this.ionContent.ionScroll.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      this.trackTapeService.tracksLastScrollPositionForTape = event.detail.scrollTop
    })
    if( !this.trackTapeService.tracks.length){
      this.getTracks()
    }

  }

  ionViewDidLeave(){
    this.destroy$.next()
  }

  ngOnInit() {}

}
