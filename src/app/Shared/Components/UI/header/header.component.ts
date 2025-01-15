import { Component, Input, OnInit } from '@angular/core';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ButtonsModule] 
})
export class HeaderComponent  implements OnInit {
  @Input() secondButtonIcon!: string
  @Input() headerTitle!: string
  constructor() { }

  
  ngOnInit() {}

}
