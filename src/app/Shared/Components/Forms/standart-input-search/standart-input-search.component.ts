import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-standart-input-search',
  templateUrl: './standart-input-search.component.html',
  styleUrls: ['./standart-input-search.component.scss'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule]
})
export class StandartInputSearchComponent  implements OnInit {

  constructor() { }

  searchForm: FormGroup = new FormGroup({
    searchInput: new FormControl('')
  })

  @HostListener('document:click', ['$event'])
   onClick(event: MouseEvent): void {
  let target = event.target as HTMLElement
    if (target.getAttribute('name') !== this.selectedName) {
          this.clearItems()
      }
   }

  @Input() searchItems: string[] = ['Екатеринбург','Москва','Асбест','Питер']

  @Input() label:string = 'Поиск области' 
  searchValue: string = ''
  searchCurrentItems: string[] = []
  @Output() changeSearchValue: EventEmitter<string> = new EventEmitter()
  @Input() selectedName:string = ''
  
  setSearchItem(item: any) {
    let searchItem = item
    this.searchValue = searchItem
    this.searchForm.patchValue({
      searchInput: searchItem
    })
    this.clearItems()
  }

  clearItems(){
    this.searchValue = ''
    this.searchCurrentItems = []
  }

  searchInputChange(event:any) {
    this.searchValue = event.target.value
    this.search()
  }
  search() {
    this.searchCurrentItems = this.searchItems.filter(item => item.toLowerCase().includes(this.searchValue.toLowerCase()))
  }

  ngOnInit() {
    this.searchForm.get('searchInput')?.valueChanges.subscribe((value: string) => {
      if(value.length){
        this.changeSearchValue.emit(value)
      }
    });
  }

}
