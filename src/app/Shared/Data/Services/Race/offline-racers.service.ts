import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ApplicationFilters } from '../../Interfaces/filters/application.filter.interface'

@Injectable({
  providedIn: 'root',
})
export class OfflineRacersService {
  constructor() {}
  http: HttpClient = inject(HttpClient)

  createOfflineRacer(raceId: number, data: any) {
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${raceId}/appointment-race/offline`, data)
  }
  getOfflineRacer(raceId: number | string, applicationFilters: ApplicationFilters = {}) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${raceId}/appointment-race/offline`, {
      params: { ...applicationFilters },
    })
  }
  deleteOfflineRacer(raceId: number | string, appointmentId: number) {
    return this.http.delete(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/appointment-race/offline/${appointmentId}`)
  }
  updateOfflineRacer(raceId: number | string, appointmentId: number, data: any) {
    return this.http.patch(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/appointment-race/offline/${appointmentId}`, data)
  }
}
