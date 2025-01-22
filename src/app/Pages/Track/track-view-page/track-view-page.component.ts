import { Component, inject, OnInit } from '@angular/core';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import {TuiSelectModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
@Component({
  selector: 'app-track-view-page',
  templateUrl: './track-view-page.component.html',
  styleUrls: ['./track-view-page.component.scss'],
  imports: [
    SharedModule,
    HeaderModule,
    CheckImgUrlPipe,
    SlidersModule,
    AngularYandexMapsModule,
    ButtonsModule,
    TuiSelectModule,
    TuiTextfieldControllerModule
]
})

export class TrackViewPageComponent  implements OnInit {
  private readonly destroy$ = new Subject<void>()
  track!:Track 
  trackService:TrackService = inject(TrackService)
  trackId!: string 
  constructor() { }
  route: ActivatedRoute = inject(ActivatedRoute)
  loadingService: LoadingService = inject(LoadingService)

   getTrack(){
    this.loadingService.showLoading()
    this.trackService.getTrackById(this.trackId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()  
      })
    ).subscribe((res:any) => {
      this.track = res.track
    })
    console.log(this.track)
   }
   goToPoint(){
    if (this.track?.latitude && this.track?.longitude) {
      window.location.href = 'https://yandex.ru/maps/?rtext=~' + this.track.latitude + ',' + this.track.longitude
    } else {
      // this.toastService.showToast('Произошла ошибка при получении координат', 'warning')
    }
   }
  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.trackId = params['id']
      this.getTrack()

    })
  }
  ionViewDidLeave(){
    this.destroy$.next()
  }

  ngOnInit() {}

}
