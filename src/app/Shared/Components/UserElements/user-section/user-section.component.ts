import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-section',
  templateUrl: './user-section.component.html',
  styleUrls: ['./user-section.component.scss'],
  imports: [CheckImgUrlPipe,CommonModule],
})
export class UserSectionComponent  implements OnInit {

  constructor() { }
  @Output() changeStatus = new EventEmitter();
  @Input() user !:User|null
  @Input() status ?:string

  onClickStatus(){
    this.changeStatus.emit()
  }
  ngOnInit() {}

}
