import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports:[SharedModule, CommonModule, HeaderModule]
})
export class SettingsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
