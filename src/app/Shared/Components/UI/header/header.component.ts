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
  @Input() hiddenBackButton: boolean = false
  @Input() secondButtonIcon!: string
  @Input() headerTitle!: string
  @Output() secondButtonClick: EventEmitter<any> = new EventEmitter();
  @Input() customBackFunction!:void
  @Input() customBack: boolean = false
  @Input() customButton = false
  @Input() icon?:string
  @Output() customBackClick: EventEmitter<boolean> = new EventEmitter
  constructor() { }
  backButtonClick() {
    this.customBackClick.emit(true)
  }

  secondButtonClickFunction(){
    this.secondButtonClick.emit()
  }

 

  
  ngOnInit() {}

}
