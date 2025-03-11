import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { IonModal, NavController } from '@ionic/angular/standalone';
import { EventModule } from 'src/app/Shared/Modules/event/event.module';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.scss'],
  imports: [SharedModule,HeaderModule,EventModule,IonModal]
})
export class MyEventsPageComponent  implements OnInit {

  constructor() { }
  navController: NavController = inject(NavController)
  eventService: EventService = inject(EventService)
  events!:any
  tableModalValue:boolean = false
  googleTabsLink:string = ''
  userService: UserService = inject(UserService)
  loadingService:LoadingService = inject(LoadingService)

  redirectInCreate(){
    this.navController.navigateRoot('/create-event')
  }
  
  generateGoogleLink(eventId:any){
    this.loadingService.showLoading()
    this.eventService.generateGoogleLink(eventId).pipe(
      finalize(()=> this.loadingService.hideLoading())
    ).subscribe((res:any)=>{
      this.tableModalValue = true
      this.googleTabsLink = res.table_url
    })
  }

  redirectInEditPage(eventId:any){
    this.navController.navigateForward(`/race/edit/${eventId}`,{ animationDirection: 'forward' })
  }

closetTableModal(){
  this.tableModalValue = false
}
  userHaveRoot(){
    return this.userService.user.value?.roles.find((role:any)=>role.name == userRoles.admin || role.name == userRoles.root) !== undefined
  }

  ionViewWillEnter(){
    
    this.loadingService.showLoading()
    this.eventService.getEventByUserId(String(this.userService.user.value?.id)).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()
      })
    ).subscribe((res:any)=>{
      this.events = res.races
    })
  }

  ionViewDidLeave(){
   
  }

  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closetTableModal()
      
  })
  }

}
