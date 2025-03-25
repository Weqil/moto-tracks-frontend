import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { BottomNavComponent } from 'src/app/Shared/Components/UI/bottom-nav/bottom-nav.component';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { Link } from '../../Interfaces/navigation-link';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
@Component({
  selector: 'app-pages-with-nav',
  templateUrl: './pages-with-nav.component.html',
  standalone: true,
  styleUrls: ['./pages-with-nav.component.scss'],
  imports:[IonRouterOutlet, SharedModule, BottomNavComponent, HeaderModule]
})
export class PagesWithNavComponent  {

  constructor() { }
  router:Router = inject(Router)
  activatedRoute:ActivatedRoute = inject(ActivatedRoute)

  navController:NavController = inject(NavController)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)

  tapeLink:string =  this.switchTypeService.link.value

  links: Link[] = [
      {
        icon: '/assets/navigation/tape.svg',
        name:'Гонки',
        active:false,
        path: ['/events'],
      },
      
      {
        icon: '/assets/icons/Repeat.svg',
        name:'Трассы',
        active:false,
        path: ['/tracks'], 
      },
      {
        icon: '/assets/icons/team-bg.png',
        name:'Команды',
        active:false,
        path: ['/teams'], 
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
      this.navController.navigateForward(changedLink.path,{ animationDirection: 'forward' })
    } 
    else
    {
      this.navController.navigateForward(String(changedLink.activeLink),{ animationDirection: 'forward' })
    }
  }
 
  ngOnInit(): void {

    this.switchTypeService.currentType.pipe().subscribe((event:any)=>{
      this.links[0].activeLink =  this.tapeLink = '/' + event
    })
  
    
  }
  ionViewWillEnter(){
    this.checkCurrentPage()
  }
}
