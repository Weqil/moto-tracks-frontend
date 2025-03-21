import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NgClass } from '@angular/common'
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-rounded-button',
  templateUrl: './rounded-button.component.html',
  styleUrls: ['./rounded-button.component.scss'],
  imports: [NgClass,CommonModule]
})
export class RoundedButtonComponent implements OnInit {
  constructor() {}
  @Input() buttonText: string = ''
  @Input() icon: String = ''
  @Input() type: String = ''
  @Input() outline!: boolean
  @Input() close!: boolean
  @Input() theme: String = 'rounded-button'
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>()
  @Input() disabled: boolean = false
  onClick() {
    this.clicked.emit()
  }

  ngOnInit() {}
}
