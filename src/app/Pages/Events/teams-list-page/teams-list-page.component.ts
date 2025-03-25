import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandSectionComponent } from 'src/app/Shared/Components/Commands/command-section/command-section.component';
import { ComandsService } from 'src/app/Shared/Data/Services/Comands/comands.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { NavController, IonicModule } from '@ionic/angular';
import { StandartInputSearchComponent } from 'src/app/Shared/Components/Forms/standart-input-search/standart-input-search.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { HeaderComponent } from 'src/app/Shared/Components/UI/header/header.component';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

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
    IonicModule
  ],
  standalone: true
})
export class TeamsListPageComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();

  navController: NavController = inject(NavController);
  comandService: ComandsService = inject(ComandsService);
  loaderService: LoadingService = inject(LoadingService);

  teams: ICommand[] = [];
  filteredTeams: ICommand[] = [];
  searchQuery: string = '';

  ngOnInit() {
    this.getTeams();
  }

  getTeams() {
    this.loaderService.showLoading();
    this.comandService.getComands().pipe(
      finalize(() => this.loaderService.hideLoading())
    ).subscribe((res: any) => {
      this.teams = res.commands;
      this.filteredTeams = this.teams;
    });
  }

  filterTeams() {
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
    this.navController.navigateForward(`/command/view/${teamId}`);
  }
} 