import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { CommonModule } from '@angular/common';
import { userRoles } from 'src/app/Shared/Data/Enums/roles';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
@Component({
  selector: 'app-user-section',
  templateUrl: './user-section.component.html',
  styleUrls: ['./user-section.component.scss'],
  imports: [CheckImgUrlPipe,CommonModule],
})
export class UserSectionComponent  implements OnInit {
  userService:UserService = inject(UserService)

  constructor() { }
  @Output() changeStatus = new EventEmitter();
  @Input() user !:User|null
  @Input() showRank:boolean = false;
  @Input() showAddress:boolean = false;
  @Input() showRoles:boolean = false;
  @Input() hideEmail:boolean = false;
  @Input() status ?:string
  @Input() startNumber:boolean = false;
  @Input() name:boolean = false;
  @Input() surname:boolean = false;
  rowContent: string = 'row'
  

  translitRole:string = ''

  changeRoleName(){
    if (this.user?.roles?.length && this.userService.userHaveRoot()){
      this.translitRole = 'Комиссия';
    }
    else if (!this.user?.roles?.length && !this.userService.userHaveRoot()){
      this.translitRole = 'Болельщик';
    }
    else if (this.user?.roles?.length && !this.userService.userHaveRoot()) {
      switch (this.user.roles[0].name) {
        case (userRoles.organization):
          this.translitRole = 'Организатор';
          break;
        case (userRoles.rider):
          this.translitRole = 'Гонщик';
          break;
        case (userRoles.couch):
          this.translitRole = 'Тренер';
          break;
        // case (userRoles.commission):
        //   this.translitRole = 'Комиссия';
        //   break;
        // case (userRoles.root):
        //   this.translitRole = 'Комиссия';
        //   break;
        // case (userRoles.admin):
        //   this.translitRole = 'Комиссия';
        //   break;
      
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

  /**
   * Параметр отвечает за тему карточки пользователя стандартная, красная, желтая, зеленая. 
   */
  @Input() them:'standart-them'|'red-them'|'green-them'|'yellow-them' = 'standart-them'

   /**
   * Параметр отвечает за ширину бокового контейнера
   */
  @Input() cardLeftBorderWidth:'b0'|'b1' = 'b0'

   /**
   * Параметр отвечает за цвет бокового контейнера
   */
  @Input() borderColor: 'red'|'green'|'yellow' = 'red'

   /**
   * Функция собирает все классы и возвращает массив с нужными значениями
   */
   get getClasses():string[]{
    return [this.rowContent, this.borderColor, this.cardLeftBorderWidth, this.them]
  }

  ngOnInit() {
    
  }

}
