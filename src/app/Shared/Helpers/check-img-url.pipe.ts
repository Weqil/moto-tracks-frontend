import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'checkImgUrl',
  standalone: true
})
export class CheckImgUrlPipe implements PipeTransform {

 backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`

  checkUrlDontType(url: string|undefined|null): string{
    if (url) {
      if(url.includes('https')){
        return url;
      } else{
          url = `${this.backendUrl}${url}`
        }
      return url;
    } 
    else {
      return 'assets/images/moto-standart.jpg';
    }
  }

  transform(url: string|undefined|null, type?:string): string {
    return this.checkUrlDontType(url) 
  }

}
