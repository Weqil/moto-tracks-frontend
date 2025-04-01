import { CommonModule } from '@angular/common'
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { InfiniteScrollCustomEvent } from '@ionic/angular'
import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, NavController } from '@ionic/angular/standalone'
import { User } from 'src/app/Shared/Data/Interfaces/user-model'
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module'
import { UserSectionComponent } from "../../UserElements/user-section/user-section.component";
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module'
import { RouterLink } from '@angular/router'


@Component({
  selector: 'app-users-preview',
  templateUrl: './users-preview.component.html',
  styleUrls: ['./users-preview.component.scss'],
  imports: [CommonModule, SharedModule, IonModal, UserSectionComponent, IonHeader, CheckImgUrlPipe,IonToolbar,ButtonsModule,IonButton,RouterLink],
})
export class UsersPreviewComponent implements OnInit {
  @Input() moreCount!: string|number
  @Input() fullValueUsers!: string | number
  @Input() generateLinkUrl!: boolean
  @Input() groups:any = []
  @Input() openUsersModal: boolean = false
  navController: NavController = inject(NavController)
  sortUsers: any = {}
  @Input() users: any
  @Input() sortByGrade: boolean = true
  usersPreview: any[] = []
  @Input() spiner: boolean = false
  @Output() openModalEmit: EventEmitter<any> = new EventEmitter()
  @Output() userSelected: EventEmitter<any> = new EventEmitter
  @Output() endScroll: EventEmitter<any> = new EventEmitter()
  @Output() closeModalEmit: EventEmitter<any> = new EventEmitter()
  @Output() generateLinkButtonClick: EventEmitter<any> = new EventEmitter()

  

  formattedUsers: {group:string,users:User[]}[] = []

  generateLinkButtonClickFunction(){
    this.generateLinkButtonClick.emit()
  }
  openModal() {
    this.openModalEmit.emit()
  }
  onIonInfinite(event: any) {
    let trueEvent = event as InfiniteScrollCustomEvent
    this.endScroll.emit()

    trueEvent.target.complete()
  }
  closeModal() {
    this.closeModalEmit.emit()
  }

  createUserInAplication(aplication:any){
    let userInAplication:any = {
      name:aplication.name,
      rank:aplication.rank,
      surname:aplication.surname,
      city:aplication.city,
      avatar:aplication.user.avatar
    }
    return userInAplication
  }
  
  openUser(user: User) {
    this.userSelected.emit(user)
  }

  scrollToItem(group: string) {
    const element = document.getElementById(group);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.sortByGrade) {
      if (typeof this.users !== 'object') {
        this.usersPreview = this.users.slice(0, 8);
        if (this.groups && this.groups.length) {
          this.groups.forEach((group: any) => {
            this.sortUsers[group.name] = [];
          });
        }
      } else {
      
        this.usersPreview = [];
        this.formattedUsers = []; 
  
        Object.keys(this.users).forEach((res: any) => {
          this.formattedUsers.push({ group: res, users: this.users[res]});
          this.users[res].forEach((user: any) => {
            if (this.usersPreview.length < 8) {
              this.usersPreview.push(user);
              console.log('emae:')
              console.log(this.formattedUsers)
            }
          });
        });
      }
    }

    
  }
  ngOnInit() {
    window.addEventListener('popstate', (event) => {
      this.closeModal()})
      
  }
}

