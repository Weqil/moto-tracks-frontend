import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { MapService } from 'src/app/Shared/Data/Services/Map/map.service';
import { CheckImgUrlPipe } from 'src/app/Shared/Helpers/check-img-url.pipe';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { ToastService } from 'src/app/Shared/Services/toast.service';
import { IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle, 
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail, 
  IonModal,
  IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { CommonModule } from '@angular/common';
import { ImagesModalComponent } from 'src/app/Shared/Components/UI/images-modal/images-modal.component';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { UsersPreviewComponent } from 'src/app/Shared/Components/UI/users-preview/users-preview.component';
import { UserSectionComponent } from 'src/app/Shared/Components/UserElements/user-section/user-section.component';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-view-comand-page',
  templateUrl: './view-comand-page.component.html',
  styleUrls: ['./view-comand-page.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    HeaderComponent,
    StandartButtonComponent,
    StandartInputComponent,
    UsersPreviewComponent,
    UserSectionComponent,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    IonModal,
    IonIcon
  ],
  standalone: true
})
export class ViewComandPageComponent  implements OnInit {
  private readonly destroy$ = new Subject<void>()

  constructor() { }

  route: ActivatedRoute = inject(ActivatedRoute)
  toastService: ToastService = inject(ToastService)
  loaderService:LoadingService = inject(LoadingService)
  comandService:ComandsService = inject(ComandsService)
  mapService:MapService = inject(MapService)
  checkImgUrlPipe:CheckImgUrlPipe = inject(CheckImgUrlPipe)

  commandId:string = ''
  command!:ICommand

  avatarUrl:string = '/assets/icons/team-bg.png';
  searchRegionItems:any[] = []

  membersModalState:boolean = false
  coachesModalState:boolean = false

  membersCountModalState:boolean = false


  membersForUser: User[] = []


  openMembersCountModal() {
    this.membersCountModalState = true
  }
  closeMembersCountModal() {
    this.membersCountModalState = false
  }
  closeMembersModal() {
    this.membersModalState = false
  }

  closeCoachesModal() {
    this.coachesModalState = false
  }


  openCoaches() {
      this.coachesModalState = true
  }

  async openMembers() {
    this.getMembers()
    this.membersModalState = true
  }

  getMembers() {
    this.comandService.getMembersForUsers(Number(this.commandId)).pipe().subscribe((res:any)=>{
      this.membersForUser = res.members
      res.members.forEach((item: any) => {
        this.membersForUser.push(item)
      })
      console.log(this.membersForUser)
    })
  }

  getCommand(){
    this.comandService.getCommandById(Number(this.commandId)).pipe().subscribe((res:any)=>{
      this.command = res.command
      this.avatarUrl = res.command.avatar ? this.checkImgUrlPipe.checkUrlDontType((res.command.avatar)) : '/assets/icons/team-bg.png'
    })
  }

  getRegions(){
    this.mapService.getAllRegions().pipe().subscribe((res:any)=>{
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }

  getImgUrl() {
    return `${environment.BACKEND_URL}:${environment.BACKEND_PORT}/storage/${this.command?.avatar}`;
  }

  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          this.loaderService.showLoading()
          this.commandId = params['id']
          this.getCommand()
          this.getMembers()
          this.loaderService.hideLoading()
          // this.getRegions()
      })
  }
  ngOnInit() {}

}
