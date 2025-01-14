import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { BottomNavComponent } from 'src/app/Shared/Components/UI/bottom-nav/bottom-nav.component';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { Link } from '../../Interfaces/navigation-link';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-pages-with-nav',
  templateUrl: './pages-with-nav.component.html',
  standalone: true,
  styleUrls: ['./pages-with-nav.component.scss'],
  imports:[IonRouterOutlet, SharedModule, BottomNavComponent]
})
export class PagesWithNavComponent  {

  constructor() { }
  router:Router = inject(Router)
  activatedRoute:ActivatedRoute = inject(ActivatedRoute)

  navController:NavController = inject(NavController)

  links: Link[] = [
      {
        icon: '/assets/navigation/tape.svg',
        name:'Лента',
        active:false,
        path: ['/events','/tracks'],
      },
  
      {
        icon: '/assets/navigation/map.svg',
        name:'Рейтинг',
        path: ['/home'],
        active:false,
      },
  
      {
        icon: '/assets/navigation/favorites.svg',
        name:'Избранное',
        active:false,
        path: ['/favorites'],
      },
  
      {
        icon: '/assets/navigation/user.svg',
        name:'Профиль',
        active:false,
        path: ['/cabinet'],
      },
  
  ];

  checkCurrentPage(){
    //Очищаю активную ссылку
    this.links.forEach((link) => link.active = false);

    //Проверяю и активирую ссылку при загрузке страницы
    this.links.forEach((link) => {
      if(this.links.length < 2){
        if(this.router.url.includes(link.path[0])){
          link.active = true;
        }
      } else{
        link.path.forEach(path => {
          if(this.router.url.includes(path)){
            link.active = true;
          }
        });
      }
   
    });
  }  

  activateLink(changedLink:Link){
    this.links.forEach((link) => link.active = false);
    changedLink.active = true;
    if(changedLink.path.length !== 2){
      this.navController.navigateForward
      this.navController.navigateForward(changedLink.path)
    } 
    else
    {
      console.log(changedLink.path)
    }
  }
 
  ionViewWillEnter(){
    this.checkCurrentPage()
  }
}
