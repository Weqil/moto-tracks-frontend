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
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { StandartButtonComponent } from 'src/app/Shared/Components/UI/Buttons/standart-button/standart-button.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-view-comand-page',
  templateUrl: './view-comand-page.component.html',
  styleUrls: ['./view-comand-page.component.scss'],
  imports:[
    IonContent, 
    HeaderComponent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonCard, 
    IonCardContent,
    StandartButtonComponent,
    CommonModule
  ]
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

  

  getCommand(){
    this.comandService.getCommandById(Number(this.commandId)).pipe().subscribe((res:any)=>{
      console.log()
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

  openCoaches() {}

  openMembers() {}

  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
          this.commandId = params['id']
          this.getCommand()
          this.getRegions()
      })
  }
  ngOnInit() {}

}
