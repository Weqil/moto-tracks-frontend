import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-bottom-modal',
  templateUrl: './select-bottom-modal.component.html',
  styleUrls: ['./select-bottom-modal.component.scss'],
  imports:[CommonModule,NgClass],
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('150ms ease-out', style({ transform: 'translateY(0%)', }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class SelectBottomModalComponent  implements OnInit {

  constructor() { }
  @Input() visible = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter()

  closeTimeout: any;
  regions = [
    'Россия',
    'Иркутская область',
    'Краснодарский край',
    'Иркутская область',
    'Краснодарский край',
    'Иркутская область',
    'Краснодарский край',
    'Иркутская область'
  ];

  close() {
    this.onClose.emit()
  }

  onAnimationDone(event: any) {
    if (event.toState === 'void') {
      // тут можно убрать компонент из DOM, если он выводится *ngIf снаружи
    }
  }

  startCloseHold() {
    this.closeTimeout = setTimeout(() => this.close(), 500);
  }

  cancelCloseHold() {
    clearTimeout(this.closeTimeout);
  }

  ngOnInit() {}
  
}
