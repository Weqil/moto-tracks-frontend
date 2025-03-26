import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectStateService } from '../../../../../Services/select-state.service';

@Component({
  selector: 'app-standart-input-select',
  templateUrl: './standart-input-select.component.html',
  styleUrls: ['./standart-input-select.component.scss'],
  standalone: true,
  imports: [CommonModule, NgClass]
})
export class StandartInputSelectComponent implements OnDestroy {
  private subscription: Subscription;
  
  @Input() selectedItem: { name: string; value: string } = { name: '', value: '' };
  @Input() items: { name: string; value: string }[] = [];
  @Input() selectedName: string = 'selectedModal';
  @Input() label: string = '';
  @Input() invalid: boolean = false;
  @Input() errorMessage: string = '';
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @Input() stateValue: boolean = false;

  constructor(private selectStateService: SelectStateService) {
    this.subscription = this.selectStateService.activeSelectName$.subscribe((activeName: string | null) => {
      const previousActive = this.selectStateService.getPreviousActiveSelect();
      if (activeName && activeName !== this.selectedName && previousActive === this.selectedName) {
        this.stateValue = false;
      }
      this.stateValue = activeName === this.selectedName;
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.standart-input-select')) {
      this.selectStateService.closeAllSelects();
    }
  }

  changeState() {
    if (!this.stateValue) {
      this.selectStateService.setActiveSelect(this.selectedName);
      this.stateValue = true;
    } else {
      this.selectStateService.closeAllSelects();
      this.stateValue = false;
    }
  }

  changeSelectedItem(item: { name: string; value: string }) {
    this.onChange.emit(item);
    this.selectedItem = item;
    this.changeState();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
