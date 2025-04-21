import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ICommand, ICommandCreate } from 'src/app/Shared/Data/Interfaces/command';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-command-section',
  templateUrl: './command-section.component.html',
  imports: [CommonModule, CheckImgUrlPipe, IonicModule],
  styleUrls: ['./command-section.component.scss'],
  standalone: true
})
export class CommandSectionComponent implements OnInit {
  @Input() command!: ICommand;
  @Output() toggleMembership = new EventEmitter<number>();
  
  currentUserId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
  }

  onToggleMembership(event: Event) {
    event.stopPropagation();
    this.toggleMembership.emit(this.command.id);
  }
}
