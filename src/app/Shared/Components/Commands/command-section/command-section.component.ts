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

  redirectInViewPage(vievComand:any){
    this.navController.navigateForward(`/command/view/${vievComand}`)
  }

  redirectInEditPage(editComand:any){
    console.log('типа перешел на редактирование')
    this.navController.navigateForward(`/command/edit/${editComand}`)
  }

  onToggleMembership(event: Event) {
    event.stopPropagation();
    this.toggleMembership.emit(this.command.id);
  }
}
