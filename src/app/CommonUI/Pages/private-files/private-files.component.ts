import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, of, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-private-files',
  templateUrl: './private-files.component.html',
  styleUrls: ['./private-files.component.scss'],
  imports:[IonRouterOutlet, IonContent]
  
})
export class PrivateFilesComponent  implements OnInit {
  private readonly destroy$ = new Subject<void>()
  

  constructor() { }

  route: ActivatedRoute = inject(ActivatedRoute)
  userService: UserService = inject(UserService)

  documentId!: number 

  getDocument(): void {
    this.userService.getUserDocumentFileBiId(this.documentId)
    .pipe(
      catchError((err) => {
        console.error(err);
        return of(null);
      }),
      finalize(()=>{
        //
      })
    )
    .subscribe((response: Blob | null) => {
      if (response) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document_'+ this.documentId +'.pdf'; // Укажите имя файла и расширение
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    })
  }
  

  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).pipe(
          finalize(()=>{
        })
      ).subscribe((params) => {
          this.documentId = params['id']
      })
  }

  ngOnInit() {

  }

}
