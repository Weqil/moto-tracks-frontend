import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() customBackFunction!:void
  @Input() customBack: boolean = false
  @Input() customButton = false;
  @Output() customBackClick: EventEmitter<boolean> = new EventEmitter
  constructor() { }
  backButtonClick() {
    this.customBackClick.emit(true)
  }

  
  ngOnInit() {}

}
