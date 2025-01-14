import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
@Component({
  selector: 'app-pages-with-nav',
  templateUrl: './pages-with-nav.component.html',
  standalone: true,
  styleUrls: ['./pages-with-nav.component.scss'],
  imports:[IonRouterOutlet]
})
export class PagesWithNavComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
