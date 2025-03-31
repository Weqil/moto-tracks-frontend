import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }
  http:HttpClient = inject(HttpClient)
 
  getAllRegions(existsRace?: boolean, existsTrack?: boolean, existComand?: boolean){
    console.log(existsRace)
    console.log(existsTrack)

    const query = {
      raceCountExists: existsRace ? '1' : '0',
      trackCountExists: existsTrack ? '1' : '0',
      commandCountExists: existComand ? '1' : '0'
    };
    return this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/locations`, {params: query})
  }
}
