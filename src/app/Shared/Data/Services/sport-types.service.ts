import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SportTypesService {

  constructor() { }

  http:HttpClient = inject(HttpClient)
  selectSportCategory = new BehaviorSubject(false)

  setContentType(contentType:{id:number, name:string}){
    localStorage.setItem('contentTypeId', String(contentType.id))
    localStorage.setItem('contentTypeName', String(contentType.name))
  }

  getContentTypeInLocalStorage(){
    if(!localStorage.getItem('contentTypeId') || !localStorage.getItem('contentTypeName')){
      return null
    }
    return {id:localStorage.getItem('contentTypeId'), name: localStorage.getItem('contentTypeName')} 
  }

  getAllSportCategory(){
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/content-type`)
  }


}
