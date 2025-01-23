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

@Component({
  selector: 'app-my-tracks-page',
  templateUrl: './my-tracks-page.component.html',
  styleUrls: ['./my-tracks-page.component.scss'],
  imports: [SharedModule, HeaderModule, ButtonsModule, RoundedButtonComponent,TrackModule,RouterLink] 
})
export class MyTracksPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  trackService: TrackService = inject(TrackService)
  userService: UserService = inject(UserService)

  tracks!:Track[]
  redirectInCreate(){
    this.navController.navigateForward('/create-track')
  }
  getMyTracks(){
    console.log(this.userService.user.value)
    this.trackService.getTracksByUserId(String(this.userService.user.value?.id)).subscribe((res:any) => {
      this.tracks = res.tracks
    })
  }
  ionViewWillEnter(){
    this.getMyTracks()
  }
  ngOnInit() {}

}
