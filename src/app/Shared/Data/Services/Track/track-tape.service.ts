import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../../Interfaces/login-model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserService } from '../User/user.service';
import { Track } from '../../Interfaces/track-model';

@Injectable({
  providedIn: 'root'
})
export class TrackTapeService {

  constructor() { }

  tracks: Track[] = []
  tracksLastScrollPositionForTape: number = 0
 
}
