import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {IconButtonComponent} from "@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component";
import {Link} from "@app/CommonUI/Interfaces/navigation-link";
import {SharedModule} from "@app/Shared/Modules/shared/shared.module";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    IconButtonComponent,
    SharedModule,
  ]
})
export class FooterComponent   {
  @Input() links!: Link[];
  @Input() header!: boolean;
  @Output() linkChanged: EventEmitter<Link> = new EventEmitter();

  constructor() { }



  handleLinkClick(link: Link){
    this.linkChanged.emit(link);
  }

}
