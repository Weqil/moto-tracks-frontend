import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root'
})
export class ComandsService {
  private http: HttpClient = inject(HttpClient);
  private userService: UserService = inject(UserService);
  private readonly apiUrl = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api`;

  constructor() { }

  createComand(formdata:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`, formdata)
  }
  editComand(formdata:FormData, eventId:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${eventId}`, formdata)
  }

  // getComandsLocationId(params?:{locationId?:string[]}){
  //   return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`, {params:{...params}})
  // }

  getComands(params?: { userId?: number, checkMember?: boolean, ownerId?: number, locationId?: number}) {
    const queryParams: { [key: string]: number } = {};
    const userId = this.userService.user.value?.id;
    
    if (userId) {
      queryParams['userIdExists'] = userId;
      queryParams['checkMember'] = 1;
      
    }

    if (params?.ownerId) {
      queryParams['userId'] = params.ownerId;
    }
    
    if (params?.locationId) {
      queryParams['locationId'] = params.locationId;
    }
    
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`, { params: queryParams });
  }

  getCommandById(id: number): Observable<{ command: ICommand }> {
    const queryParams: { [key: string]: number } = {};
    const userId = this.userService.user.value?.id;
    
    if (userId) {
      queryParams['userIdExists'] = userId;
    }
    queryParams['checkMember'] = 1;
    
    return this.http.get<{ command: ICommand }>(`${this.apiUrl}/commands/${id}`, { params: queryParams });
  }

  getMembersForUsers(commandId: number) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${commandId}/members`);
  }

  getMembersForCoach(commandId: number) {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${commandId}/members-for-coach`);
  }

  getCoachesForUsers() {}

  toggleMember(commandId: number): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/commands/${commandId}/members`, {});
  }
}
