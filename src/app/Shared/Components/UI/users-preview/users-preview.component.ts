import { CommonModule } from '@angular/common'
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core'
import { InfiniteScrollCustomEvent } from '@ionic/angular'
import { IonHeader, IonIcon, IonModal, IonToolbar, NavController } from '@ionic/angular/standalone'
import { User } from 'src/app/Shared/Data/Interfaces/user-model'
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module'
import { UserSectionComponent } from "../../UserElements/user-section/user-section.component";
import { CheckImgUrlPipe } from "../../../Helpers/check-img-url.pipe";
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module'


@Component({
  selector: 'app-users-preview',
  templateUrl: './users-preview.component.html',
  styleUrls: ['./users-preview.component.scss'],
  imports: [CommonModule, SharedModule, IonModal, UserSectionComponent, IonHeader, CheckImgUrlPipe,IonToolbar,ButtonsModule],
})
export class UsersPreviewComponent implements OnInit {
  @Input() moreCount!: string|number
  @Input() fullValueUsers!: string | number
  @Input() generateLinkUrl!: boolean
  @Input() groups:any = []
  @Input() openUsersModal: boolean = false
  navController: NavController = inject(NavController)
  sortUsers: any = {}
  @Input() users: User[] = []
  usersPreview: any[] = []
  @Input() spiner: boolean = false
  @Output() openModalEmit: EventEmitter<any> = new EventEmitter()
  @Output() userSelected: EventEmitter<any> = new EventEmitter
  @Output() endScroll: EventEmitter<any> = new EventEmitter()
  @Output() closeModalEmit: EventEmitter<any> = new EventEmitter()
  @Output() generateLinkButtonClick: EventEmitter<any> = new EventEmitter()



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
  
  openUser(user: User) {
    this.userSelected.emit(user)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.usersPreview = this.users.slice(0, 8)
    if(this.groups && this.groups.length){
      this.groups.forEach((group:any) => {
        this.sortUsers[group.name] = []
      });
    }
    
    
  }
  ngOnInit() {}
}
