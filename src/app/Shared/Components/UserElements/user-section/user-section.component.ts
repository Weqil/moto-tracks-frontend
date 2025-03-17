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
  @Input() showRank:boolean = true;
  @Input() showAddress:boolean = true;
  @Input() hideEmail:boolean = false;
  @Input()  status ?:string

  translitRole:string = ''

  changeRoleName(){
    if (this.user?.roles?.length) {
      switch (this.user.roles[0].name) {
        case 'Organization':
          this.translitRole = 'Организатор';
          break;
        case 'Rider':
          this.translitRole = 'Гонщик';
          break;
        case 'Couch':
          this.translitRole = 'Тренер';
          break;
        default:
          this.translitRole = 'Болельщик';
      }
    }
  }

  onClickStatus(){
    this.changeStatus.emit()
  }

  ngOnChanges(){
    this.changeRoleName()
  }

  ngOnInit() {
    
  }

}
