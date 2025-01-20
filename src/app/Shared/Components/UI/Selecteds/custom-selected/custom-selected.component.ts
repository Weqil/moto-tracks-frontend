import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'

interface changeItem {
  id: number
  name: string
  value: string
  icon?: string
}
@Component({
  selector: 'app-custom-selected',
  templateUrl: './custom-selected.component.html',
  styleUrls: ['./custom-selected.component.scss'],
  imports:[NgClass,CommonModule]
})
export class CustomSelectedComponent implements OnInit {
  constructor() {}
  @Input() modalValue: boolean = false
  @Input() items: changeItem[] = []
  @Input() selectedValue!: changeItem
  @Output() closeModal: EventEmitter<any> = new EventEmitter()
  @Output() openModal: EventEmitter<any> = new EventEmitter()
  @Output() selectItem: EventEmitter<changeItem> = new EventEmitter()
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    let target = event.target as HTMLElement
    if (target.getAttribute('name') !== 'selectedModal') {
      this.closeModal.emit()
    }
  }
  selectValue(event: changeItem) {
    this.selectItem.emit(event)
  }

  closeModalFunction() {
    this.closeModal.emit()
  }
  openModalFunction() {
    this.openModal.emit()
  }

  changeModalState() {
    if (!this.modalValue) {
      this.openModal.emit()
    } else {
      this.closeModal.emit()
    }
  }

  ngOnInit() {}
}
