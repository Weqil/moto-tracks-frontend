import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";

@Component({
  selector: 'app-command-section',
  templateUrl: './command-section.component.html',
  imports:[CommonModule,CheckImgUrlPipe],
  styleUrls: ['./command-section.component.scss'],
})
export class CommandSectionComponent  implements OnInit {

  constructor() { }
  @Input() command!:ICommand

  ngOnInit() {}

}
