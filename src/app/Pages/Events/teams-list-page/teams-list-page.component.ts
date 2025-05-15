import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandSectionComponent } from 'src/app/Shared/Components/Commands/command-section/command-section.component';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { NavController, IonicModule } from '@ionic/angular';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { AuthService } from '../../../Shared/Services/auth.service';
import { MapService } from '@app/Shared/Data/Services/Map/map.service';
import { isNull } from 'lodash';
import { IconButtonComponent } from '@app/Shared/Components/UI/LinarikUI/buttons/icon-button/icon-button.component';
import { StandartInputComponent } from '@app/Shared/Components/UI/LinarikUI/forms/standart-input/standart-input.component';

@Component({
  selector: 'app-teams-list-page',
  templateUrl: './teams-list-page.component.html',
  styleUrls: ['./teams-list-page.component.scss'],
  imports: [
    CommonModule,
    CommandSectionComponent,
    FormsModule,
    StandartInputSearchComponent,
    HeaderComponent,
    IonicModule,
    IconButtonComponent,
    StandartInputComponent
  ],
  standalone: true
})
export class TeamsListPageComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();

  navController: NavController = inject(NavController);
  comandService: ComandsService = inject(ComandsService);
  loaderService: LoadingService = inject(LoadingService);
  authService: AuthService = inject(AuthService);
  mapService:MapService = inject(MapService)
  loadingService:LoadingService = inject(LoadingService)

  teamslocation: ICommand[] = [];
  teams: ICommand[] = [];
  teamsFormGroup = new FormGroup({
    searchInput: new FormControl('')
  })
  filteredTeams: ICommand[] = [];
  searchQuery: string = '';
  currentUserId: number | null = null;
  regionFilterName:string = 'Россия'    
  searchRegionItems:any[] = []
  regionModalState:boolean = false

  locationId!:number

  openRegionModal(){
    this.regionModalState = true
  }
  closeRegionModal(){
    this.regionModalState = false
  }

  filterEventsInLocation(event:any){
    this.regionFilterName = event.name
    this.locationId = event.value 
    this.closeRegionModal()
    this.getTeamslocation()
  }

  

  getRegions(){
    this.mapService.getAllRegions(false, false, true).pipe().subscribe((res:any)=>{
      this.searchRegionItems.push({
        name:'Россия',
        value:''
      })
      res.data.forEach((region:any) => {
        this.searchRegionItems.push({
          name:`${region.name} ${region.type}`,
          value:region.id
        })
      });
    })
  }
  back(){
    this.navController.back()
  }
  setRegion(event:any){

  }

  ngOnInit() {

    this.getTeams()
    this.getRegions()
    this.teamsFormGroup.get('searchInput')?.valueChanges.subscribe(value => {
      if(!value){
        this.filteredTeams = this.teams
      }
    });
    this.currentUserId = this.authService.getCurrentUserId();
  }
  
  getTeamslocation() {
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })
    this.comandService.getComandLocationId({
      locationId: this.locationId
    }).pipe(
      finalize(() => this.loaderService.hideLoading(loader))
    ).subscribe((res: any) => {
      
      this.teams = res.commands;
      this.filteredTeams = this.teams;
    });
  }


  getTeams() {
    let loader:HTMLIonLoadingElement
    this.loadingService.showLoading().then((res: HTMLIonLoadingElement)=>{
        loader = res
    })
    this.comandService.getComands({
      userId: this.currentUserId || undefined,
      checkMember: true,
    }).pipe(
      finalize(() => this.loaderService.hideLoading(loader))
    ).subscribe((res: any) => {
      
      this.teams = res.commands;
      this.filteredTeams = this.teams;
    });
  }

  filterTeams() {
    this.searchQuery = this.teamsFormGroup.value.searchInput ? this.teamsFormGroup.value.searchInput : '';
    if (!this.searchQuery) {
      this.filteredTeams = this.teams;
      return;
    }
    
    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      team.full_name?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchInput(event: any) {
    this.searchQuery = event.target.value;
    this.filterTeams();
  }

  viewTeam(teamId: number) {
    console.log('viewTeam', teamId);
    this.navController.navigateForward(`/command/view/${teamId}`);
  }

  toggleTeamMembership(teamId: number) {
    this.loaderService.showLoading();
    this.comandService.toggleMember(teamId).pipe(
      finalize(() => this.loaderService.hideLoading())
    ).subscribe(() => {
      this.getTeams(); // Обновляем список команд после изменения
    });
  }
} 