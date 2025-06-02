import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Documents } from '@app/Shared/Data/Interfaces/document-models';
import { User } from '@app/Shared/Data/Interfaces/user-model';

import { UserService } from '@app/Shared/Data/Services/User/user.service';
import { LoadingService } from '@app/Shared/Services/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-in-application',
  templateUrl: './user-in-application.component.html',
  styleUrls: ['./user-in-application.component.scss'],
})
export class UserInApplicationComponent  implements OnInit {

  // @Input() userId!: string
  @Input() arrayDocument: Documents[]=[]
  @Input() user!:User 
  userService: UserService = inject(UserService)
  loadingService: LoadingService = inject(LoadingService)
  loaderService:LoadingService = inject(LoadingService)
  licensed!: Documents
  polish!: Documents
  notarius!: Documents

  

  constructor() { }

  // getDocumentUserById(){

  //   this.userService.getUserDocumentFileBiId(this.user.id).pipe().subscribe((res:any)=>{
  //     this.arrayDocument = res.documents 
  //     console.log(this.arrayDocument)
  //   })

  // }

  identificationOfDocument(){

    for (const doc of this.arrayDocument){

      switch(doc.type){
        
      case "licenses":
     
      this.licensed = doc
      break;

      case "notarius":
   
      this.notarius = doc
      break;

      case "polis":
     
      this.polish = doc
      break;

    }
    }

    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['arrayDocument'] && this.arrayDocument?.length) {
      this.identificationOfDocument();
    }
  }

  ngOnInit() {
    
    
    
  }

  // getUser(){
  //   let loader:HTMLIonLoadingElement
  //   this.loaderService.showLoading().then((res:HTMLIonLoadingElement)=>{
  //     loader = res
  //    })

    
    
  //   this.userService.getUserById(this.userId).pipe(
  //     finalize(()=>{
  //       this.loadingService.hideLoading(loader)  
  //     })
  //   ).subscribe((res:any) => {
  //     this.user = res.user
  //     // console.log('emae2:')
  //     // console.log(this.user)
  //   })
  //  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['userId']) {
      
      

  //   }
  // }

}
