import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { RouterLink } from '@angular/router';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { TrackTapeService } from 'src/app/Shared/Data/Services/Track/track-tape.service';
import { IonContent, NavController, IonModal } from '@ionic/angular/standalone';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { FormsModule } from "../../../Shared/Modules/forms/forms.module";
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';

@Component({
  selector: 'app-track-tape-page',
  templateUrl: './track-tape-page.component.html',
  styleUrls: ['./track-tape-page.component.scss'],
  imports: [SharedModule, HeaderModule, TrackModule, IonModal, RouterLink, FormsModule]
})

export class TrackTapePageComponent  implements OnInit {

  regionFilterName:string = 'Россия'
  regionFilterId:string = ''
  regionModalState:boolean = false
  searchRegionItems:any[] = []

  constructor() { }
  private readonly destroy$ = new Subject<void>()
  navController: NavController = inject(NavController)
  mapService:MapService = inject(MapService)
  trackService:TrackService = inject(TrackService)
  trackTapeService:TrackTapeService = inject(TrackTapeService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  loadingService:LoadingService = inject(LoadingService)

  @ViewChild(IonContent) ionContent!: IonContent

  getTracks(){
    this.loadingService.showLoading()
    this.trackService.getTracks({locationId:[this.regionFilterId]}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.trackTapeService.tracks = res.tracks
    })
  }

  redirectInEvents(){
    this.navController.navigateForward('/events')
  }

  openRegionModal(){
    this.regionModalState = true
  }
  closeRegionModal(){
    this.regionModalState = false
  }

  getRegions(){
    this.mapService.getAllRegions(false, true).pipe().subscribe((res:any)=>{
      this.searchRegionItems.push({
        name:'Россия',
        value:''
      })
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }

  filterEventsInLocation(event:any){
    this.regionFilterName = event.name
    this.regionFilterId = event.value
    this.closeRegionModal()
    this.getTracks()
    
  }

  ionViewWillEnter(){

    this.switchTypeService.setTypeInLocalSorage('tracks')
    this.ionContent.scrollToPoint(0, this.trackTapeService.tracksLastScrollPositionForTape, 0)
    this.ionContent.ionScroll.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      this.trackTapeService.tracksLastScrollPositionForTape = event.detail.scrollTop
    })
      this.getTracks()
  }

  ionViewDidLeave(){
    this.destroy$.next()
  }

  ngOnInit() {
    this.getRegions()
  }

}
