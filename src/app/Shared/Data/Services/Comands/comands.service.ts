import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICommand } from 'src/app/Shared/Data/Interfaces/command';
import { User } from 'src/app/Shared/Data/Interfaces/user-model';

@Injectable({
  providedIn: 'root'
})
export class ComandsService {

  constructor() { }

  http:HttpClient = inject(HttpClient)
  private readonly apiUrl = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api`;

  createComand(formdata:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`, formdata)
  }
  editComand(formdata:FormData, eventId:string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands/${eventId}`, formdata)
  }

  getComands(params?:{userId?:number}){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/commands`,{params:{...params}})
  }

  getCommandById(id: number): Observable<{ command: ICommand }> {
    return this.http.get<{ command: ICommand }>(`${this.apiUrl}/commands/${id}`);
  }

  getMembersForUsers(commandId: number): Observable<{ members: User[] }> {
    return this.http.get<{ members: User[] }>(`${this.apiUrl}/commands/${commandId}/members-for-coach`);
  }

  getCoachesForUsers() {}

  toggleMember(commandId: number): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.apiUrl}/commands/${commandId}/members`, {});
  }
}
