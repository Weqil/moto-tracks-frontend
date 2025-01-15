import { Injectable } from '@angular/core';
import { Login } from '../../Interfaces/login-model';
import { User } from '../../Interfaces/user-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  public user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.getUserFromLocalStorage())

  constructor() { }
  //Занёс данные о пользователе
  setUserInLocalStorage(user:User){
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  //Получил данные о пользователе
  getUserFromLocalStorage():User|null {
    if(localStorage.getItem('user')){
      return JSON.parse(String(localStorage.getItem('user')));
    } else {
      return null;
    }
   
  }
}
