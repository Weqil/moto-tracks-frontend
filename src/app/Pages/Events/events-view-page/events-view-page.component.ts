import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IEvent } from 'src/app/Shared/Data/Interfaces/event';
import { EventService } from 'src/app/Shared/Data/Services/Event/event.service';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { SlidersModule } from 'src/app/Shared/Modules/sliders/sliders.module';
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module';
import { TrackSectionComponent } from "../../../Shared/Components/Track/track-section/track-section.component";



@Component({
  selector: 'app-events-view-page',
  templateUrl: './events-view-page.component.html',
  styleUrls: ['./events-view-page.component.scss'],
  imports: [SharedModule, SlidersModule, ButtonsModule, TrackSectionComponent]
})
export class EventsViewPageComponent  implements OnInit {

  constructor() { }
  
  private readonly destroy$ = new Subject<void>()

  route: ActivatedRoute = inject(ActivatedRoute)
  eventService: EventService = inject(EventService)
  loadingService: LoadingService = inject(LoadingService)

  event!:IEvent
  eventId: string = ''

  getEvent(){
    this.loadingService.showLoading()
    this.eventService.getEventById(this.eventId).pipe(
      finalize(()=>{
        this.loadingService.hideLoading()
      })
    ).subscribe((res:any)=>{
      console.log(res)
      this.event = res.race
    })
  }

  ionViewWillEnter(){
 
    this.route.params.pipe(takeUntil(this.destroy$)).pipe(
      finalize(()=>{
    
      })
    ).subscribe((params) => {
        this.eventId = params['id']
        this.getEvent()
      })
    }
  ngOnInit() {}

}
