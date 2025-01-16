import { Component, Input, OnInit } from '@angular/core';
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
  @Input() user !:User|null

  ngOnInit() {}

}
