import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class formdataService {

  constructor() { }

  formdataAppendJson(fd: FormData, data:any){
    for (let key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
                fd.append(`${key}[${index}]`, item);
           })
        } 
        else {
            fd.append(key, data[key] !== null ? data[key] : '')
        }
    }
    return fd

  }
  
}
