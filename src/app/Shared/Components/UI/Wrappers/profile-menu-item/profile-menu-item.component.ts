import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile-menu-item',
  templateUrl: './profile-menu-item.component.html',
  styleUrls: ['./profile-menu-item.component.scss'],
  imports: [CommonModule]
})
export class ProfileMenuItemComponent  implements OnInit {

  constructor() { }
  @Input() name!: string
  @Input() icon!: string
  @Input() iconColor!: string
  @Input() iconFilter!: string
  @Input() routing!: string

  navController: NavController = inject(NavController)
  redirectInPage(){
    this.navController.navigateForward([this.routing])
  }
  ngOnInit() {}

}
