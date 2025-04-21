import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from 'src/app/CommonUI/Interfaces/navigation-link';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { IconButtonComponent } from "../LinarikUI/buttons/icon-button/icon-button.component";


@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SharedModule,
    IconButtonComponent
]
})

export class BottomNavComponent  {

  @Input() links!: Link[] 
  @Output() linkChanged: EventEmitter<Link> = new EventEmitter();

  constructor() { }
  
  //Отправляю ссылку
  handleLinkClick(link: Link){
    this.linkChanged.emit(link);
  }
 
  ionViewWillEnter(){
   
  }
 

}
