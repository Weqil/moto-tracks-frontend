import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { HeaderModule } from "../../../Shared/Modules/header/header.module";
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";


@Component({
  selector: 'app-user-view-page',
  templateUrl: './user-view-page.component.html',
  styleUrls: ['./user-view-page.component.scss'],
  imports: [HeaderModule, IonContent, CheckImgUrlPipe],
})
export class UserViewPageComponent  implements OnInit {

  user!:User 
  userId!: string 
  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  route: ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  loaderService:LoadingService = inject(LoadingService)
  @Input() userIdGet!: string


  constructor() { }

  ngOnInit() {

    if(this.userIdGet){
      this.userId = this.userIdGet
      this.getUser()
    }else{
      this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        this.userId = params['id']
        this.getUser()})
    }
  
  }
  
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
