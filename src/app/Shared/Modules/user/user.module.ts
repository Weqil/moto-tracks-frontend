import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSectionComponent } from '../../Components/UserElements/user-section/user-section.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserSectionComponent
  ],
  exports: [UserSectionComponent]
})
export class UserModule { }
