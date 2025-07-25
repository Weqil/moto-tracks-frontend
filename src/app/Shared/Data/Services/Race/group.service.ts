import { query } from '@angular/animations'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor() {}
  http: HttpClient = inject(HttpClient)

  // getAllRegions(){
  //   return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/locations`,)
  // }

  getAllGroup(params?: any) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/grades`, { params })
  }
  createGroup(groupForm: { name: string; description?: string }) {
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/grades`, groupForm)
  }

  getGroupById(id: string) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/grades/${id}`, {
      params: {
        id: id,
      },
    })
  }
}
