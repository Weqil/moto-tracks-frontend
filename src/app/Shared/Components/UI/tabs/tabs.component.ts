
import { AfterViewInit, Component, ContentChildren, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TabsItemComponent } from '../tabs-item/tabs-item.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports:[CommonModule]
})
export class TabsComponent  implements OnInit, AfterViewInit {
  @ContentChildren(TabsItemComponent, { read: ElementRef }) tabs!: QueryList<TabsItemComponent> //Получаем из ng-content
  @ViewChildren('item') tabsView!: QueryList<ElementRef>  
  tabsItems: any[] = []

  constructor() { }


  ngAfterViewInit() 
  {
      setTimeout(() => {
        this.tabsView.first.nativeElement ? this.setActiveTab(this.tabsItems[0], this.tabsView.first.nativeElement) : null
      })
      this.tabs.toArray().forEach((tab: any) => {
        let name = tab.nativeElement.getAttribute('name')
        this.tabsItems.push({ tab: tab.nativeElement, name: name })
      })
      if (this.tabsItems) {
      }
    }
  
  
  ionViewWillEnter() {}
  setActiveTab(tab: any, itemTab: HTMLElement) {
    this.tabsView.forEach((item: any) => {
      if (tab.name == item.nativeElement.getAttribute('id')) {
        item.nativeElement.style.display = 'block'
        item.nativeElement.classList.remove('tabs__item')
        item.nativeElement.classList.add('tabs__item_active')
      } else {
        item.nativeElement.classList.add('tabs__item')
        item.nativeElement.classList.remove('tabs__item_active')
      }
    })
    this.tabsItems.forEach((item: any) => {
      if (item.name == tab.name) {
        item.tab.style.display = 'block'
      } else {
        item.tab.style.display = 'none'
      }
    })
  }


  ngOnInit() {}

}
