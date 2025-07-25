import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { IEvent } from '@app/Shared/Data/Interfaces/event'
import { Grade } from '@app/Shared/Data/Interfaces/grade'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class StoreReslutsService {
  constructor() {}
  http: HttpClient = inject(HttpClient)
  public currentRace$: BehaviorSubject<IEvent | null> = new BehaviorSubject<IEvent | null>(null)
  public currentGrade$: BehaviorSubject<Grade | null> = new BehaviorSubject<Grade | null>(null)

  public setCurrentGrade(grade: Grade | null) {
    this.currentGrade$.next(grade)
  }

  public getCurrentGrade(): Grade | null {
    return this.currentGrade$.getValue()
  }
  
  public setCurrentRace(event: IEvent | null) {
    this.currentRace$.next(event)
  }

  public getCurrentRace(): IEvent | null {
    return this.currentRace$.getValue()
  }
}
