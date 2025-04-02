import { Component, inject, OnInit } from '@angular/core';
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



  constructor() { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id']
      this.getUser()
      
    })
  }
  
  getUser(){
    this.loadingService.showLoading()
    this.userService.getUserById(this.userId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()  
      })
    ).subscribe((res:any) => {
      this.user = res.user
      console.log('emae2:')
      console.log(this.user)
    
    })
   }

  ionViewWillEnter(){
   
  }

  

}
