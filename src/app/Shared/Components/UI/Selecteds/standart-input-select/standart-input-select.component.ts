import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectStateService } from '../../../../../Services/select-state.service';

@Component({
  selector: 'app-standart-input-select',
  templateUrl: './standart-input-select.component.html',
  styleUrls: ['./standart-input-select.component.scss'],
  imports: [CommonModule,NgClass],
  providers: [SelectStateService]
})
export class StandartInputSelectComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor() {

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    let target = event.target as HTMLElement;
    let currentElement: HTMLElement | null = target;
    
    // Проверяем, является ли кликнутый элемент или его родители частью нашего селекта
    while (currentElement) {
      if (currentElement.getAttribute('name') === this.selectedName || 
          currentElement.classList.contains('standart-input') ||
          currentElement.classList.contains('dropdown-content--active')) {
        return;
      }
      currentElement = currentElement.parentElement;
    }
    
    // Если клик был вне селекта, закрываем его
    this.stateValue = false;
  }

  @Input() selectedItem: {name: string; value: string} = {name: '', value: ''};
  @Output() onChange:EventEmitter<any> = new EventEmitter()
  @Input() items: {name: string; value: string}[] = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'}
  ];
  @Input() selectedName:string = 'selectedModal'
  @Input() label: string = '';
  @Input() iconLeft:string = ''
  @Input() invalid:boolean = false
  @Input() readonly:boolean = false
  @Input() errorMessage:string = ''
  @Input() stateValue: boolean = false;
  @Input() labelLight: boolean = false;

  changeState(){
    
    if (!this.stateValue && !this.readonly) {
      this.stateValue = true;
    } else {
      this.stateValue = false;
    }
  }
  
  changeSelectedItem(item: {name: string; value: string}){
    this.onChange.emit(item);
    this.selectedItem = item;
    this.changeState();
  }

  ngOnInit() {}

  ngOnDestroy() {
  
  }
}
