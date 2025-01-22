import { Injectable } from '@angular/core';
import { IEvent } from '../../Interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class EventTapeService {

  constructor() { }
   events: IEvent[] = []
   eventsLastScrollPositionForTape: number = 0
}
