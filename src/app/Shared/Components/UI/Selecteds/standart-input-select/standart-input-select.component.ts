import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-standart-input-select',
  templateUrl: './standart-input-select.component.html',
  styleUrls: ['./standart-input-select.component.scss'],
  imports: [CommonModule,NgClass]
})
export class StandartInputSelectComponent  implements OnInit {

  constructor() { }
@HostListener('document:click', ['$event'])
 onClick(event: MouseEvent): void {
let target = event.target as HTMLElement
  if (target.getAttribute('name') !== this.selectedName) {
        this.stateValue = false
    }
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
  @Input() stateValue: boolean = false;

  changeState(){
    this.stateValue =!this.stateValue;
  }
  
  changeSelectedItem(item: {name: string; value: string}){
    this.onChange.emit(item);
    this.selectedItem = item;
    this.changeState();
  }
  ngOnInit() {}

}
