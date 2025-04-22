import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-the-program',
  templateUrl: './about-the-program.component.html',
  styleUrls: ['./about-the-program.component.scss'],
})
export class AboutTheProgramComponent  implements OnInit {

  constructor() { }
  navControler: NavController = inject(NavController);
  version:string = environment.version

  navigateInAgreed(){
    
    setTimeout(()=>{
      this.navControler.navigateForward('/distribution-agreement')
    },0)
  }

  navigateInOferta(){
    
    setTimeout(()=>{
      this.navControler.navigateForward('/oferta')
    },0)
  }

  ngOnInit() {}

}
