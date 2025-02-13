import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/Shared/Modules/shared/shared.module';
import { LoadingService } from 'src/app/Shared/Services/loading.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
  imports: [SharedModule,PdfViewerModule]
})
export class ViewDocumentComponent  implements OnInit {

  constructor() { }
  route: ActivatedRoute = inject(ActivatedRoute)
  private readonly destroy$ = new Subject<void>()
  documentUrl: string = ''
  loadingService: LoadingService = inject(LoadingService)

  hidePdfLoader(){
    this.loadingService.hideLoading()
  }

  ionViewWillEnter() {
    this.loadingService.showLoading()
    this.route.params.pipe(takeUntil(this.destroy$)).pipe( finalize(()=>{})).subscribe((params) => {
      this.documentUrl = params['url'] 
      console.log(this.documentUrl)})
  }
  ionViewDidEnter() {
    this.loadingService.hideLoading()
  }
  ngOnInit() {}

}
