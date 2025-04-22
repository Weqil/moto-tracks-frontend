import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../Shared/Components/UI/header/header.component";
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.scss'],
  imports: [IonContent, HeaderComponent],
})
export class OfertaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
