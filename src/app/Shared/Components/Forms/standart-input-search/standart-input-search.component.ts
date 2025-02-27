import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandSectionComponent } from '../../Commands/command-section/command-section.component';

@Component({
  selector: 'app-standart-input-search',
  templateUrl: './standart-input-search.component.html',
  styleUrls: ['./standart-input-search.component.scss'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule,CommandSectionComponent]
})
export class StandartInputSearchComponent  implements OnInit {

  constructor() { }

  searchForm: FormGroup = new FormGroup({
    searchInput: new FormControl('')
  })


  @Input() searchItems: any[] = []
  @Input() searchCommands: boolean = false
  @Input() label:string = 'Поиск области' 
  searchValue: string = ''
  seacrhObject: any 
  @Input() searchCurrentItems: any[] = []
  @Output() changeSearchValue: EventEmitter<string> = new EventEmitter()
  @Input() selectedName:string = ''
  
  setSearchItem(item: any) {
    let searchItem = item
    this.seacrhObject = item
    if(this.seacrhObject){
      this.changeSearchValue.emit(this.seacrhObject)
    }
    this.searchForm.patchValue({
      searchInput: searchItem.name
    })
    this.clearItems()
  }

  ngOnChanges(changes: SimpleChanges): void {
   
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
    this.searchCurrentItems = this.searchItems.filter(item => item.name.toLowerCase().includes(this.searchValue.toLowerCase()))
  }

  ngOnInit() {
    this.searchCurrentItems = this.searchItems
  }

}
