import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { ICommand, ICommandCreate } from 'src/app/Shared/Data/Interfaces/command';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../Services/auth.service';
import { IconButtonComponent } from "../../UI/LinarikUI/buttons/icon-button/icon-button.component";
import {NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-command-section',
  templateUrl: './command-section.component.html',
  imports: [CommonModule, CheckImgUrlPipe, IonicModule, IconButtonComponent],
  styleUrls: ['./command-section.component.scss'],
  standalone: true
})
export class CommandSectionComponent implements OnInit {
  @Input() command!: ICommand;
  @Input() editfFunction: boolean = false;
  @Input() editComand!: number;
  @Input() vievComand!: number;
  @Output() toggleMembership = new EventEmitter<number>();

  navController: NavController = inject(NavController)
  
  currentUserId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
  }

  redirectInViewPage(){
    if(this.command.id){
      this.navController.navigateRoot(`/command/view/${this.command.id}`)
    }

  }

  redirectInEditPage(editComand:any){
    this.navController.navigateRoot(`/command/edit/${editComand}`)
  }

  onToggleMembership(event: Event) {
    event.stopPropagation();
    this.toggleMembership.emit(this.command.id);
  }
}
