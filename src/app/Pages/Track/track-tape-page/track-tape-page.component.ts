import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { RouterLink } from '@angular/router';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { TrackTapeService } from 'src/app/Shared/Data/Services/Track/track-tape.service';
import { IonContent, NavController, IonModal } from '@ionic/angular/standalone';
import { finalize, takeUntil } from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { FormsModule } from "../../../Shared/Modules/forms/forms.module";
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { FormControl, FormGroup } from '@angular/forms';
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { RegionsSelectModalComponent } from '@app/Shared/Components/Modals/regions-select-modal/regions-select-modal.component';
import { NavbarVisibleService } from '@app/Shared/Services/navbar-visible.service';
import {ScreenService} from "@app/Shared/Services/screen.service";
import {CustomSelectedComponent} from "@app/Shared/Components/UI/Selecteds/custom-selected/custom-selected.component";
import {
  StandartInputSelectComponent
} from "@app/Shared/Components/UI/Selecteds/standart-input-select/standart-input-select.component";

@Component({
  selector: 'app-track-tape-page',
  templateUrl: './track-tape-page.component.html',
  styleUrls: ['./track-tape-page.component.scss'],
  imports: [SharedModule, HeaderModule, TrackModule, IonModal, RouterLink, StandartInputComponent, IconButtonComponent, RegionsSelectModalComponent, CustomSelectedComponent, StandartInputSelectComponent]
})

export class TrackTapePageComponent  implements OnInit, OnDestroy{

  regionFilterName:string = 'Россия'
  regionFilterId:string = ''
  regionModalState:boolean = false
  searchRegionItems:any[] = []

  constructor() { }
  private readonly destroy$ = new Subject<void>()
  navController: NavController = inject(NavController)
  mapService:MapService = inject(MapService)
  navBarVisibleService:NavbarVisibleService = inject(NavbarVisibleService)
  trackService:TrackService = inject(TrackService)
  trackTapeService:TrackTapeService = inject(TrackTapeService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  loadingService:LoadingService = inject(LoadingService)

  screenService: ScreenService = inject(ScreenService)
  isDesktop!: boolean
  private screenSub!: Subscription

  searchTapeTrackForm:FormGroup = new FormGroup({
    searchInput: new FormControl('')
  })

  @ViewChild(IonContent) ionContent!: IonContent

  getTracks(){
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((loading:HTMLIonLoadingElement)=>loader = loading)
    this.trackService.getTracks({locationId:[this.regionFilterId], name:this.searchTapeTrackForm.value.searchInput}).pipe(
      finalize(()=>this.loadingService.hideLoading(loader))
    ).subscribe((res:any)=>{
      this.trackTapeService.tracks = res.tracks
    })
  }

  redirectInEvents(){
    this.navController.navigateForward('/events')
  }

  openRegionModal(){
    this.regionModalState = true
    if (!this.isDesktop) {  // не скрывает навбар в веб-версии
      this.navBarVisibleService.hideNavBar()
    }
  }
  closeRegionModal(){
    setTimeout(()=>{
      this.navBarVisibleService.showNavBar()
    },100)
    this.regionModalState = false
  }

  search(){
   this.getTracks()
  }
  clearAllFilters(){
    this.regionFilterId = ''
    this.regionFilterName = 'Россия' // при нажатии на кнопку "все" не очищался регион в инпуте
    this.searchTapeTrackForm.patchValue({
      searchInput:''
    })
    this.getTracks()
  }

  getRegions(){
    this.mapService.getAllRegions(false, true,false).pipe().subscribe((res:any)=>{
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
    this.searchTapeTrackForm.patchValue({
      searchInput:''
    })
    this.destroy$.next()
  }

  ngOnInit() {
    this.searchTapeTrackForm.get('searchInput')?.valueChanges.subscribe(value => {
      if(!value){
        this.getTracks()
      }
    });
    this.getRegions()

    this.screenSub = this.screenService.isDesktop$.subscribe((value) => {
      this.isDesktop = value
    })

    // console.log(this.isDesktop)
    if (this.isDesktop) {
      console.log('Desktop')
    } else {
      console.log('Mobile')
    }
  }

  ngOnDestroy() {
    this.screenSub.unsubscribe()
  }

}
