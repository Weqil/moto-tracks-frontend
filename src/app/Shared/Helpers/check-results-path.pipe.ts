import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkResultsPath',
  standalone: true
})
export class CheckResultsPathPipe implements PipeTransform {

  checkUrl(url: string){
    try {
       return url .split('/')[2].split('.')[0].split('_')[0]
    }
    catch (e) {
      return '';
    }
    
  }
  transform(url:string): string {
    return this.checkUrl(url);
  }

}
