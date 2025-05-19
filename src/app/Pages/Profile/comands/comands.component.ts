import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { CommandSectionComponent } from 'src/app/Shared/Components/Commands/command-section/command-section.component';
import { RoundedButtonComponent } from 'src/app/Shared/Components/UI/Buttons/rounded-button/rounded-button.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

@Component({
  selector: 'app-comands',
  templateUrl: './comands.component.html',
  styleUrls: ['./comands.component.scss'],
  imports:[IonContent,HeaderComponent,RoundedButtonComponent,CommandSectionComponent,CommonModule,StandartButtonComponent,IconButtonComponent]
})
export class ComandsComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  comandService: ComandsService = inject(ComandsService)
  loaderService:LoadingService = inject(LoadingService)
  userService: UserService = inject(UserService)

  comands:ICommand[] = []

  redirectInCreate(){
    this.navController.navigateRoot('/create-comands')
  }
  redirectInEditPage(eventId:any){
    this.navController.pop();
    this.navController.navigateRoot(`/command/edit/${eventId}`)
  }
  back(){
    this.navController.back()
  }
  redirectInViewPage(eventId:any){
    this.navController.pop();
    this.navController.navigateRoot(`/command/view/${eventId}`)
  }
  getMyComands(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
    })
    this.comandService.getComands({
      userId: this.userService.user.value?.id,
      ownerId: this.userService.user.value?.id
    }).pipe(
      finalize(
        ()=>{
          this.loaderService.hideLoading(loader)
        }
      )
    ).subscribe((res:any)=>{
      this.comands = res.commands
    })
  }
  ionViewWillEnter(){
    this.getMyComands()
  }
  ionViewDidLeave(){
    console.log('died')
  }
  ngOnInit() {}

}
