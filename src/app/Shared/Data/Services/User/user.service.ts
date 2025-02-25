import { inject, Injectable } from '@angular/core';
import { Login } from '../../Interfaces/login-model';
import { User } from '../../Interfaces/user-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { userRoles } from '../../Enums/roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  public user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(this.getUserFromLocalStorage())

  http:HttpClient = inject(HttpClient)

  constructor() { }

  //Занёс данные о пользователе
  setUserInLocalStorage(user:User){
    if(user){
      this.user.next(user);
      localStorage.setItem('user', JSON.stringify(user));

    }
  }

  hasRole(roleName: string): boolean {
    return this.user.value?.roles.find((role: any) => role.name === roleName) !== undefined;
  }

  deleteUser(){
    
  }
  userHaveRoot(){
    return this.user.value?.roles.find((role:any)=> role.name == userRoles.admin || role.name == userRoles.root) !== undefined
  }
  createUserDocument(document:any){
    console.log(document)
    document.append('url', `${environment.BASE_URL}/document/`)
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents`, document)
  }

  updateDocument(id:number,document:any){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents/${id}/update`, document)
  }

  getUserDocuments(){
    return this.http.get<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents`)
  }

  getUserDocumentFileBiId(id: number): Observable<Blob> {
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents/${id}/files`, { responseType: 'blob' })

  }

  getUserFromServerWithToken(){
       return this.http.get<User>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users`)
  }
  refreshUser(){
    this.getUserFromServerWithToken().pipe().subscribe((res:any)=>{
      this.setUserInLocalStorage(res.user);
    })
  }
  
  clearUser(){
    localStorage.removeItem('user');
    this.user.next(null);
  }

  createPersonalInfo(personalForm:any){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/personal-info`, personalForm )
  }

  updatePersonalInfo(personalForm:any){
    return this.http.patch(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/personal-info`, personalForm )
  }

  //Получил данные о пользователе
  getUserFromLocalStorage():User {
    return JSON.parse(String(localStorage.getItem('user')));
  }
  editUser(editForm:FormData){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/update`, editForm)
  }
  getChangeRoles(){
    return this.http.get<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/roles-change`)
  }

  changeRoleForDefaultUser(roleId:string){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/roles-change`, { roleId: roleId })
  }

  //Проверка подтвержденной почты
  isEmailVerified(): boolean {
    return this.user.value?.email_verified_at!== null;
  }
}
