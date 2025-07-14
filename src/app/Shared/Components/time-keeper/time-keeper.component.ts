import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@app/Shared/Interfaces/user.interface';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';


interface IStatusTimeKeeper {
  circlesAll: number,
  timeToGo: Date,
  timing: Date,
  syncTime: Date,
  color?: string,
}
interface IRacerTimeKeeper {
  startNumber: number,
  time?: Date,
  name?: string,
  firstName?: string,
  city?: string,
  position?: number,
  nowCircle?: number,
  bestCircle?: number,
  bestCircleTime?: Date,
  lastTime?: Date,
  backlog?: any,
  user?:  User 
}
@Component({
  selector: 'app-time-keeper',
  templateUrl: './time-keeper.component.html',
  styleUrls: ['./time-keeper.component.scss'],
  imports: [NgFor],
})
export class TimeKeeperComponent  implements OnInit, OnDestroy {

  constructor() { }

  private socket!: WebSocket
  private http: HttpClient = inject(HttpClient)

  @Input() raceIdWS!: number
  @Input() racers: any = []

  racerSock: IRacerTimeKeeper[] = []
  urlWebsocket!: string

  arrivalName: string = ''
  gradeName: string = ''
  status?: IStatusTimeKeeper

  onMessage(data: string) {
    const mess: any[] = data.split(',')

    if (mess.length === 0) return

    switch(mess[0]) {
      case '$F':
        this.status = {
          circlesAll: mess[1].replace(/"/g, ''),
          timeToGo: mess[2].replace(/"/g, ''),
          timing: mess[4].replace(/"/g, ''),
          syncTime: mess[3].replace(/"/g, ''),
          color: mess[5].replace(/"/g, ''),
        }
        break
      case '$B': // Устанавливаем название заезда
        this.arrivalName = mess[2].replace(/"/g, '')
        break
      case '$A':
        let racer: IRacerTimeKeeper = {
          startNumber: mess[1].replace(/"/g, ''),
          time: mess[3].replace(/"/g, ''),
          name: mess[4].replace(/"/g, ''),
          firstName: mess[5].replace(/"/g, ''),
          city: mess[6].replace(/"/g, ''),
        }
        const key_user = this.racers.findIndex((race:any) => race.start_number == racer.startNumber)
        if (key_user !== -1) {
          racer.user = this.racers[key_user]
        }
        const key_a = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.startNumber === racer.startNumber)
        if (key_a === -1) { 
          this.racerSock.push(racer) 
        } else { 
          this.racerSock[key_a].time = racer.time
        }
        break
      case '$G':
        const key_g = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.startNumber === mess[2].replace(/"/g, ''))
        if (key_g !== -1) {
          this.racerSock[key_g].position = mess[1].replace(/"/g, '')
          this.racerSock[key_g].nowCircle = Number(mess[3].replace(/"/g, ''))
          this.racerSock.sort((a: any, b: any) => a.position - b.position)
        }
        break
      case '$H':
        const key_h = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.startNumber === mess[2].replace(/"/g, ''))
        if (key_h !== -1) {
          this.racerSock[key_h].bestCircle = mess[1].replace(/"/g, '')
          this.racerSock[key_h].bestCircleTime = mess[4].replace(/"/g, '')
        }
        break
      case '$J':
        const key_j = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.startNumber === mess[1].replace(/"/g, ''))
        if (key_j !== -1) {
          this.racerSock[key_j].lastTime = mess[2].replace(/"/g, '')
          this.racerSock[key_j].time = mess[3].replace(/"/g, '')

        }
        break
      case '$RMLT':
        const key_rmlt = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.startNumber === mess[1].replace(/"/g, ''))
        const key_lider = this.racerSock.findIndex((race: IRacerTimeKeeper) => race.position === 1)
        if (key_rmlt !== -1) {
          // this.racerSock[key_rmlt].backlog = moment.unix(mess[2].replace(/"/g, '') / 1000000).format('hh:mm:ss.SSS')
          this.racerSock[key_rmlt].backlog = Number(mess[2].replace(/"/g, '')) - Number(this.racerSock[key_lider].backlog)

        }
        break
      case '$C':
        this.gradeName = mess[2]
        break
      case '$I':
        this.racerSock = []
        this.gradeName = ''
        this.status = {
        circlesAll: 0,
        timeToGo: new Date(),
        timing: new Date(),
        syncTime: new Date(),
      }
        break
    }
  }
  openSocket(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      // console.log('Соединение установлено');
    };

    this.socket.onmessage = (event) => {
      const data: any[] = event.data.split('\n')
      data.forEach((value: string) => {
        this.onMessage(value);
      })
    };

    this.socket.onclose = (event) => {
      this.racerSock = []
      this.gradeName = ''
      this.status = {
        circlesAll: 0,
        timeToGo: new Date(),
        timing: new Date(),
        syncTime: new Date(),
      }
      this.setUrlWSAndOpenWS()

    }

    this.socket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

  }

  setUrlWSAndOpenWS() {
    this.http.get(`${environment.BACKEND_URL}:${environment.BACKEND_PORT}/api/races-ws/` + this.raceIdWS)
    .pipe()
    .subscribe((response: any) => {
      this.openSocket('wss://' + response.LiveTimingHost + '/instance/' + response.CurrentRaces[0].Instance + '/' + response.LiveTimingToken)
    })
  }


  ngOnInit() {
    this.setUrlWSAndOpenWS()
  }
  ngOnDestroy() {
    this.socket.close()
  }

}
