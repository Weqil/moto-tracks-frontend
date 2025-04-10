import { inject, Injectable } from '@angular/core';
import { Login } from '../../Interfaces/login-model';
import { User } from '../../Interfaces/user-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { userRoles } from '../../Enums/roles';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  public user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(this.getUserFromLocalStorage())

  http:HttpClient = inject(HttpClient)
 
  allRoles:Array<{id:number,name:string}>|null = null
  constructor(
  ) { }

  getUserById(id:string){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/${id}`)
  }

  getAllUsersInLocalStorage(){
    let usersArray:any = localStorage.getItem('allUsers')
    if(usersArray){
      usersArray = JSON.parse(usersArray)
    }else{
      usersArray = []
    }
    return usersArray
  }

  deleteUserInUsersArrayInLocalStorage(user:User){
    let usersArray:any = localStorage.getItem('allUsers')
    if(usersArray){
      usersArray = JSON.parse(usersArray)
    }else{
      usersArray = []
    }
    usersArray = usersArray.filter((userInArray:any)=> userInArray.id!= user.id)
    localStorage.setItem('allUsers', JSON.stringify(usersArray))
    this.user.next(this.user.value)
  }

  //Занёс данные о пользователе
  setUserInLocalStorage(user:User,token?:string|null) {
    if(user){
     
      let usersArray:any = localStorage.getItem('allUsers')
      if(usersArray){
        usersArray = JSON.parse(usersArray)
      }else{
        usersArray = []
      }
      if(!usersArray.find((userInArray:any)=> userInArray.id == user.id)){
        if(token){
          user.access_token = token
        }
        usersArray.push(user)
      }else if(usersArray.find((userInArray:any)=> userInArray.id == user.id)){
        if(token){
          user.access_token = token
        }
        let index = usersArray.findIndex((currentUser:User) => currentUser.id == user.id)
        if(index >= 0 && usersArray[index]){
          usersArray[index] = user
        }
      }
      localStorage.setItem('allUsers', JSON.stringify(usersArray))
    
      this.user.next(user);
      localStorage.setItem('user', JSON.stringify(user));

    }
  }

  hasRole(roleName: string): boolean {
    return this.user.value?.roles.find((role: any) => role.name === roleName) !== undefined;
  }

  deleteUser() {
    return this.http.delete(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users`);
  }

  userHaveRoot(){
    return this.user.value?.roles.find((role:any)=> role.name == userRoles.admin || role.name == userRoles.root || role.name == userRoles.commission) !== undefined
  }
  createUserDocument(document:any){
    document.append('url', `${environment.BASE_URL}/document/`)
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents`, document)
  }

  updateDocument(id:number,document:any){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/cabinet/documents/${id}/update`, document)
  }

  userHaveCurrentPersonal(){
    let userPersonalForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      patronymic: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
    })
    userPersonalForm.patchValue({
        ...this.user.value?.personal,
        dateOfBirth: this.user.value?.personal?.date_of_birth
    })
    return userPersonalForm.valid
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
  getAuthToken(){
    if(localStorage.getItem('authToken')){
      return String(localStorage.getItem('authToken'))
    }else{
      return null
    }
   
  }
  refreshUser(callback?: () => void){
    this.getUserFromServerWithToken().pipe().subscribe((res:any)=>{
      this.setUserInLocalStorage(res.user, this.getAuthToken());
      this.user.next(res.user);
      if (callback) {
        callback();
      }
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
  editUser(editForm:any){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users/update`, editForm)
  }
  getChangeRoles(){
    return this.http.get<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/roles-change`)
  }

  changeRoleForDefaultUser(roleId:string){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/roles-change`, { roleId: roleId })
  }

  getComissionUsers(){
    return this.http.get<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/users-commissions`)
  }

  //Проверка подтвержденной почты
  isEmailVerified(): boolean {
    return this.user.value?.email_verified_at!== null;
  }

  addComission(id:number,usersId:number[]){
    return this.http.post<any>(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races/${id}/commission/add`,{usersIds:usersId},)
  }

  isPhoneVerified(): boolean {
    if(!this.user.value?.phone){
      return false
    }
    return this.user.value?.phone?.number_verified_at !== null;
  }

  addUserCommissionRole(userId: string){
    return this.http.post(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/roles-change/${userId}/commission`, userId)
  }
  
}
