import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, of, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/Shared/Data/Services/User/user.service';
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoadingService } from 'src/app/Shared/Services/loading.service';
import { AngularImageViewerModule } from "@clarivate/angular-image-viewer";



@Component({
  selector: 'app-private-files',
  templateUrl: './private-files.component.html',
  styleUrls: ['./private-files.component.scss'],
  imports:[IonRouterOutlet, IonContent, CommonModule, PdfViewerModule,AngularImageViewerModule ]
  
})
export class PrivateFilesComponent  implements OnInit {
  private readonly destroy$ = new Subject<void>()
  

  constructor() { }

  route: ActivatedRoute = inject(ActivatedRoute)
  images:any = []
  imageIndex:number = 1
  userService: UserService = inject(UserService)
  fileType: string = ''
  fileUrl: string = ''
  loadingService: LoadingService = inject(LoadingService)
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
        // const url = window.URL.createObjectURL(response);
        // const a = document.createElement('a');
        // a.href = url;
        let ras;
        this.fileType = 'img'
        console.log(response.type)
        switch(response.type) {
          case 'image/jpeg':
            ras = '.jpg'
            break
          case 'application/pdf':
            ras = '.pdf'
            this.loadingService.showLoading()
            this.fileType = 'pdf'
            
            break
          case 'image/png':
            ras = '.png'
            break
          case 'image/jpg':
            ras = '.jpg'
            break
        }
       
        // a.download = 'document_'+ this.documentId + ras; // Укажите имя файла и расширение
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);
        const url = window.URL.createObjectURL(response);
        this.fileUrl = url;
        if(this.fileType === 'img'){
          this.images.push(this.fileUrl)
          console.log(this.images)
        }

      }
    })
  }
  

  hidePdfLoader(){
    this.loadingService.hideLoading()
  }
  ionViewWillEnter(){
    this.route.params.pipe(takeUntil(this.destroy$)).pipe(
          finalize(()=>{
        })
      ).subscribe((params) => {
          this.documentId = params['id']
          this.getDocument()
      })
  }

  ngOnInit() {

  }

}
