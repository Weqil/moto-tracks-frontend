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
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service';
import { IonModal } from '@ionic/angular/standalone';
import { HeaderModule } from 'src/app/Shared/Modules/header/header.module';
import { StandartInputComponent } from 'src/app/Shared/Components/Forms/standart-input/standart-input.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-events-view-page',
  templateUrl: './events-view-page.component.html',
  styleUrls: ['./events-view-page.component.scss'],
  imports: [SharedModule, SlidersModule, ButtonsModule, TrackSectionComponent,IonModal,HeaderModule, StandartInputComponent]
})
export class EventsViewPageComponent  implements OnInit {

  constructor() { }
  
  private readonly destroy$ = new Subject<void>()

  route: ActivatedRoute = inject(ActivatedRoute)
  eventService: EventService = inject(EventService)
  loadingService: LoadingService = inject(LoadingService)
  switchTypeService:SwitchTypeService = inject(SwitchTypeService)
  event!:IEvent
  eventId: string = ''
  personalUserForm: FormGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(3)]),
      patronymic: new FormControl('', [Validators.required, Validators.minLength(3)]),
      dateOfBirth: new FormControl('', [Validators.required, Validators.minLength(3)]),
      city: new FormControl('', [Validators.required, Validators.minLength(3)]),
      inn: new FormControl('', [Validators.required, Validators.minLength(3)]),
      snils: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
      startNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
      group:new FormControl('', [Validators.required, Validators.minLength(3)]),
      rank:new FormControl('', [Validators.required, Validators.minLength(3)]),
      rankNumber:new FormControl('', [Validators.required, Validators.minLength(3)]),
      community:new FormControl('', [Validators.required, Validators.minLength(3)]),
      coach:new FormControl('', [Validators.required, Validators.minLength(3)]),
      motoStamp:new FormControl('', [Validators.required, Validators.minLength(3)]),
      engine:new FormControl('', [Validators.required, Validators.minLength(3)]),
    })

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
