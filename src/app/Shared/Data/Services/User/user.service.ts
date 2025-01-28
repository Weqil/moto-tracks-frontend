import { inject, Injectable } from '@angular/core';
import { Login } from '../../Interfaces/login-model';
import { User } from '../../Interfaces/user-model';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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

 

  createUserDocument(document:any){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents`, document)
  }

  updateDocument(id:number,document:any){
    const fd: FormData = new FormData();
    fd.append('data',  JSON.stringify(document))
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents/${id}/update`, fd)
  }

  getUserDocuments(){
    return this.http.get<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents`)
  }

  getUserFromServerWithToken(){
       return this.http.get<User>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users`)
  }
  refreshUser(){
    this.getUserFromServerWithToken().pipe().subscribe((res:any)=>{
      console.log(res);
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
}
