import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'checkImgUrl',
  standalone: true,
  pure: false
})
@Injectable({
  providedIn: 'root'
})
export class CheckImgUrlPipe implements PipeTransform {
backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`

  checkUrlDontType(url: string|undefined|null, standartImageUrl?:string): string{
   
    if (url) {
 
      if(url.includes('https')){
        return url;
      } else{
          url = `${this.backendUrl}/storage/${url}`
        }
      return url;
    } 
    else {
      if(standartImageUrl){
        return standartImageUrl;
      }else{
        return 'assets/images/standartAvatar.jpg';
      }
     
    }
  }

  transform(url: string|undefined|null, standartImageUrl?:string): string {
    return this.checkUrlDontType(url,standartImageUrl) 
  }

}
