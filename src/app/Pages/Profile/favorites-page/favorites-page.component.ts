import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss'],
  imports: [SharedModule] 
})
export class FavoritesPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
