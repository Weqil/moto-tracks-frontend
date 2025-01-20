import { Component, Input, OnInit } from '@angular/core';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ButtonsModule,NgClass,CommonModule] 
})
export class HeaderComponent  implements OnInit {
  @Input() secondButtonIcon!: string
  @Input() headerTitle!: string
  @Input() customButton = false;
  constructor() { }

  
  ngOnInit() {}

}
