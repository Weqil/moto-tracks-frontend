import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { RoundedButtonComponent } from "../../../../Shared/Components/UI/Buttons/rounded-button/rounded-button.component";
import { NavController } from '@ionic/angular/standalone';
import { TrackService } from 'src/app/Shared/Data/Services/Track/track.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { Track } from 'src/app/Shared/Data/Interfaces/track-model';
import { TrackModule } from 'src/app/Shared/Modules/track/track.module';
import { RouterLink } from '@angular/router';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';

@Component({
  selector: 'app-my-tracks-page',
  templateUrl: './my-tracks-page.component.html',
  styleUrls: ['./my-tracks-page.component.scss'],
  imports: [SharedModule, HeaderModule, RoundedButtonComponent,TrackModule,RouterLink,IconButtonComponent] 
})
export class MyTracksPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  trackService: TrackService = inject(TrackService)
  loaderService: LoadingService = inject(LoadingService)
  userService: UserService = inject(UserService)

  tracks!:Track[]
  redirectInCreate(){
    this.navController.navigateRoot('/create-track')
  }
  getMyTracks(){
    this.loaderService.showLoading()
    this.trackService.getTracksByUserId(String(this.userService.user.value?.id)).pipe(
      finalize(()=>this.loaderService.hideLoading())
    ).subscribe((res:any) => {
      this.tracks = res.tracks
    })
  }
  back(){
    this.navController.back()
  }
  redirectInEditPage(eventId:any){
    this.navController.navigateForward(`/track/edit/${eventId}`)
  }

  ionViewDidLeave(){
  
  }

  ionViewWillEnter(){

    this.getMyTracks()
  }
  ngOnInit() {}
  
  ngOnDestroy() {
   
  }

}
