import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'src/environments/environment.prod'

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor() {}
  httpClient: HttpClient = inject(HttpClient)
  public createResults(raceId: string, racers: any[]) {
    console.log(racers)
    return this.httpClient.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/race/${raceId}/results`, {
      racers: racers,
    })
  }
  public getArrivals(raceId: string | number) {
    return this.httpClient.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/race/${raceId}/results/arrival`)
  }
}
