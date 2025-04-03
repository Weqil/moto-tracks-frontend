import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../Shared/Components/UI/header/header.component";
import { IonicModule } from '@ionic/angular';
import { FormsModule } from "../../../Shared/Modules/forms/forms.module";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StandartButtonComponent } from "../../../Shared/Components/UI/Buttons/standart-button/standart-button.component";
import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize } from 'rxjs';
import { User } from '@app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from "../../../Shared/Helpers/check-img-url.pipe";


@Component({
  selector: 'app-add-user-in-comission',
  templateUrl: './add-user-in-comission.component.html',
  styleUrls: ['./add-user-in-comission.component.scss'],
  imports: [CommonModule, HeaderComponent, IonicModule, FormsModule, StandartButtonComponent, CheckImgUrlPipe],
})
export class AddUserInComissionComponent  implements OnInit {

  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  loaderService:LoadingService = inject(LoadingService)
  constructor() { }

  ngOnInit() {}
  user!:User 
  id:string = ''
  viewUserInfo: boolean = true
  UserIdForm: FormGroup = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    }
  )



  viewUser(){
    this.viewUserInfo = false
    this.id = this.UserIdForm.get('userId')?.value
    if(this.id == ''){
      this.viewUserInfo = true
    }
    else{
      this.getUser()
      console.log(this.id)
    }
    
  }

  awardRole(){
    
  }

  getUser(){
    let loader:HTMLIonLoadingElement
    this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
      loader = res
     })
    
    this.userService.getUserById(this.id).pipe(
      finalize(()=>{
        this.loadingService.hideLoading(loader)  
      })
    ).subscribe((res:any) => {
      this.user = res.user
      // console.log('emae2:')
      // console.log(this.user)
    })
   }
}
