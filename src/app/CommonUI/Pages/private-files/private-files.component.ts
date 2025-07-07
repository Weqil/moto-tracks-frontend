import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { catchError, EMPTY, finalize, of, Subject, takeUntil } from 'rxjs'
import { UserService } from 'src/app/Shared/Data/Services/User/user.service'
import { IonRouterOutlet, IonContent } from '@ionic/angular/standalone'
import { NgxImageZoomModule } from 'ngx-image-zoom'
import { CommonModule } from '@angular/common'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { LoadingService } from 'src/app/Shared/Services/loading.service'
import { AngularImageViewerModule } from '@clarivate/angular-image-viewer'
import { CircleButtonComponent } from '@app/Shared/Components/UI/Buttons/circle-button/circle-button.component'

@Component({
  selector: 'app-private-files',
  templateUrl: './private-files.component.html',
  styleUrls: ['./private-files.component.scss'],
  imports: [IonRouterOutlet, IonContent, CommonModule, PdfViewerModule, AngularImageViewerModule, CircleButtonComponent],
})
export class PrivateFilesComponent implements OnInit {
  private readonly destroy$ = new Subject<void>()

  constructor() {}

  route: ActivatedRoute = inject(ActivatedRoute)
  images: any = []
  imageIndex: number = 1
  userService: UserService = inject(UserService)
  fileType: string = ''
  fileUrl: string = ''
  zoom: number = 1.0
  isPanning = false
  startX = 0
  startY = 0
  scrollLeft = 0
  scrollTop = 0
  panContainer: HTMLElement | null = null
  loadingService: LoadingService = inject(LoadingService)
  documentId!: number
  @Input() postDocumentId?: number
  pdfRotation: number = 0;

  startPan(event: MouseEvent) {
    this.isPanning = true
    this.panContainer = event.currentTarget as HTMLElement
    this.startX = event.pageX - this.panContainer.offsetLeft
    this.startY = event.pageY - this.panContainer.offsetTop
    this.scrollLeft = this.panContainer.scrollLeft
    this.scrollTop = this.panContainer.scrollTop
    window.addEventListener('mousemove', this.onPanWindow, true)
    window.addEventListener('mouseup', this.endPanWindow, true)
  }

  onPanWindow = (event: MouseEvent) => {
    if (!this.isPanning || !this.panContainer) return
    event.preventDefault()
    const x = event.pageX - this.panContainer.offsetLeft
    const y = event.pageY - this.panContainer.offsetTop
    this.panContainer.scrollLeft = this.scrollLeft - (x - this.startX)
    this.panContainer.scrollTop = this.scrollTop - (y - this.startY)
  }

  endPanWindow = () => {
    this.isPanning = false
    window.removeEventListener('mousemove', this.onPanWindow, true)
    window.removeEventListener('mouseup', this.endPanWindow, true)
    this.panContainer = null
  }

  onPan(event: MouseEvent) {}
  endPan() {}

  getDocument(): void {
    this.userService
      .getUserDocumentFileBiId(this.documentId)
      .pipe(
        catchError((err) => {
          console.error(err)
          return of(null)
        }),
        finalize(() => {
          //
        }),
      )
      .subscribe((response: Blob | null) => {
        if (response) {
          // const url = window.URL.createObjectURL(response);
          // const a = document.createElement('a');
          // a.href = url;
          let ras
          this.fileType = 'img'
          switch (response.type) {
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
          const url = window.URL.createObjectURL(response)
          this.fileUrl = url
          if (this.fileType === 'img') {
            this.images.push(this.fileUrl)
          }
        }
      })
  }

  hidePdfLoader() {
    this.loadingService.hideLoading()
  }
  ionViewWillEnter() {
    if (!this.postDocumentId) {
      this.route.params
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => {}))
        .subscribe((params) => {
          this.documentId = params['id']
          this.getDocument()
        })
    } else {
      this.documentId = this.postDocumentId
      this.getDocument()
    }
  }

  ngOnInit() {}

  zoomIn() {
    this.zoom += 0.1
    console.log(this.zoom)
  }
  zoomOut() {
    this.zoom -= 0.1
    console.log(this.zoom)
  }
  rotateLeft() {
    this.pdfRotation = (this.pdfRotation - 90) % 360;
    if (this.pdfRotation < 0) this.pdfRotation += 360;
  }

  rotateRight() {
    this.pdfRotation = (this.pdfRotation + 90) % 360;
  }

  resetZoom() {
    this.zoom = 1.0;
    this.pdfRotation = 0;
  }
  redirectInPdfBrowser() {
    // window.nav(fileUrl,)
    window.open(this.fileUrl, '_blank')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postDocumentId'] && changes['postDocumentId'].currentValue) {
      this.images = []
      this.fileUrl = ''
      this.documentId = changes['postDocumentId'].currentValue
      this.getDocument()
    }
  }
}
