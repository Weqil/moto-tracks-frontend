import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { HeaderModule } from "../../../Shared/Modules/header/header.module";
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";
import { IonCheckbox, IonModal, NavController, IonLabel } from '@ionic/angular/standalone';
import { IconButtonComponent } from "../../../Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import { CommonModule } from '@angular/common';
import { CheckUserRoleService } from '@app/Shared/Data/Services/check-user-role.service';
import { CommandSectionComponent } from "../../../Shared/Components/Commands/command-section/command-section.component";
import { ICommand } from '@app/Shared/Data/Interfaces/command';
import { ComandsService } from '@app/Shared/Data/Services/Comands/comands.service';

@Component({
  selector: 'app-user-view-page',
  templateUrl: './user-view-page.component.html',
  styleUrls: ['./user-view-page.component.scss'],
  imports: [HeaderModule, IonContent, CheckImgUrlPipe, IconButtonComponent, CommonModule, CommandSectionComponent],
})
export class UserViewPageComponent  implements OnInit {

  user!:User 
  command!:ICommand
  userId!: string 
  comandService: ComandsService = inject(ComandsService)
  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  route: ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  loaderService:LoadingService = inject(LoadingService)
  navController: NavController = inject(NavController)
  @Input() userIdGet!: string
  userTranslitStatuses:string[] = []
  selectedStatusItem!:any 
  checkUserRole:CheckUserRoleService = inject(CheckUserRoleService)


  back(){
    this.navController.back()
  }

  constructor() { }

  ngOnInit() {


    if(this.userIdGet){
      this.userId = this.userIdGet
      this.getUser()
    }else{
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.userId = params['id']
        this.getUser()})
        // this.getCommand(Number(this.userId))
    }
  
  }
  
  // getCommand(rcomandId: number){
  //   let loader:HTMLIonLoadingElement
  //   this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
  //     loader = res
  //    })

  //    this.comandService.getCommandById(rcomandId).pipe(
  //     finalize(()=>{
  //       this.loadingService.hideLoading(loader)  
  //     })
  //    ).subscribe((res:any)=>{
  //     // this.command = res
  //     console.log(res)
  //    })

  // }

  getUser(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })

    this.userService.getUserById(this.userId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)  
      })
    ).subscribe((res:any) => {
      this.user = res.user
      // this.comandId = res.user.personal.com
      this.userTranslitStatuses = this.checkUserRole.getUserRoleNamesInTranslit(this.user)
      // console.log('emae2:')
      // console.log(this.user)
    })
   }

  ionViewWillEnter(){
   
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userIdGet'] && changes['userIdGet'].currentValue) {
      this.userId = changes['userIdGet'].currentValue;
      this.getUser()
    }
  }

  

}
