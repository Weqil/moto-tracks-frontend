import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuItemComponent } from '../../Components/UI/Wrappers/profile-menu-item/profile-menu-item.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileMenuItemComponent
  ],
  exports: [
    ProfileMenuItemComponent
  ]
})
export class ProfileModule { }
