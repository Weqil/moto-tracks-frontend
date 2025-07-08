import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { BottomNavComponent } from 'src/app/Shared/Components/UI/bottom-nav/bottom-nav.component';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { Link } from '../../Interfaces/navigation-link';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { NavbarVisibleService } from '@app/Shared/Services/navbar-visible.service';
import { debounceTime, fromEvent, Subscription } from "rxjs";
import {FooterComponent} from "@app/Shared/Components/UI/footer/footer.component";
@Component({
  selector: 'app-pages-with-nav',
  templateUrl: './pages-with-nav.component.html',
  standalone: true,
  styleUrls: ['./pages-with-nav.component.scss'],
  imports: [IonRouterOutlet, SharedModule, BottomNavComponent, HeaderModule, FooterComponent]
})
export class PagesWithNavComponent  {

  constructor() {
    this.checkHeader()
    this.filterLinks(this.links, ['Гонки', 'Трассы', 'Команды', 'Профиль'], this.header)
  }
  router:Router = inject(Router)
  activatedRoute:ActivatedRoute = inject(ActivatedRoute)
  visibleNavBar:boolean = true
  navController:NavController = inject(NavController)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  navBarVisibleService:NavbarVisibleService = inject(NavbarVisibleService)
  tapeLink:string =  this.switchTypeService.link.value
  header: boolean = false
  private resizeSubscription!: Subscription;
  filteredLinks!: Link[];
  listOfLinksToNav: string[] = ['Гонки', 'Трассы', 'Команды', 'Профиль'] // поле name

  links: Link[] = [
      {
        //оставить [0] элементом для перехода на главную
        icon: '/assets/icons/gonki.svg',
        name:'Гонки',
        active:false,
        path: ['/events'],
      },

      {
        icon: '/assets/icons/trassy.svg',
        name:'Трассы',
        active:false,
        path: ['/tracks'],
      },
      {
        icon: '/assets/icons/team.svg',
        name:'Команды',
        active:false,
        path: ['/teams'],
      },
      {
        icon: '/assets/icons/user.svg',
        name:'Профиль',
        active:false,
        path: ['/cabinet'],
      },
    {
        icon: '/assets/icons/settings.svg',
        name:'Настройки',
        active:false,
        path: ['/settings'],
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

  checkHeader(){
    const width = window.innerWidth;
    if(width >= 1024){
      this.header = true
    }else{
      this.header = false
    }
  }

  filterLinks(links: Link[], filters: string[], isHeader: boolean) {
    if (isHeader) {
      this.filteredLinks = this.links
    } else {
      const filteredLinks = links.filter(link => filters.some(filter => link.name === filter))
      this.filteredLinks = filteredLinks
    }

  }

  ngOnInit(): void {
    this.navBarVisibleService.visible.subscribe((res)=>{
      this.visibleNavBar = res
    })
    this.switchTypeService.currentType.pipe().subscribe((event:any)=>{
      this.links[0].activeLink =  this.tapeLink = '/' + event
    })

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // Убирает лишние вызовы при частом ресайзе
      )
      .subscribe(() => {
        this.checkHeader()
        this.filterLinks(this.links, this.listOfLinksToNav, this.header)
      });
  }
  ionViewWillEnter(){
    this.checkCurrentPage()
  }
}
