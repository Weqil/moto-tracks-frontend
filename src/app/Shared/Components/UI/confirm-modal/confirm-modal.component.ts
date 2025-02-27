import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, Output } from '@angular/core'
import { EventEmitter } from '@angular/core'
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module'
import { IonModal } from "@ionic/angular/standalone";
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  standalone: true,
  imports:[SharedModule,CommonModule,ButtonsModule,IonModal]
})
export class ConfirmModalComponent implements OnInit {
  constructor() {}
  @Input() openModal: boolean = false
  @Input() text: string = 'Вы уверены?'
  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() confirm: EventEmitter<any> = new EventEmitter()
  closeModal() {
    this.cancel.emit()
  }

  confirmModal() {
    this.confirm.emit()
  }

  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closeModal()
      
  })
  }
}
