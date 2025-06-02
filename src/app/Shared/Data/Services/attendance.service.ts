import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor() { }

   private http = inject(HttpClient);

  getAttendanceForId(id: number): Observable<any> {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/race/${id}/attendances`);
  }

}
