import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { FileService } from 'src/app/Shared/Services/file.service'
import { ToastService } from 'src/app/Shared/Services/toast.service'
import { CommonModule } from '@angular/common'
import { ButtonsModule } from 'src/app/Shared/Modules/buttons/buttons.module'
@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.scss'],
  imports:[
    CommonModule,
    ButtonsModule,
    
  ]
})
export class EditSliderComponent implements OnInit {
  constructor(
    private toastService: ToastService,
    public fileService: FileService,
  ) {}
  @Input() files: any[] = []
  @ViewChild('mainPhoto') mainPhoto!: any
  @Output() filesEmit: EventEmitter<any> = new EventEmitter<any>()
  @Output() deleteVkfilesEmit: EventEmitter<any> = new EventEmitter<any>()
  @Input() type: string = ''
  @Input() categoryType!: any
  @Input() vkFiles: any[] = []
  @Input() hideLSlider: boolean = false
  previews: any[] = []
  deleteFiles: any[] = []

  ngOnChanges(changes: SimpleChanges): void {
    let previewsCount = this.previews.length
    if (changes['vkFiles']) {
      for (let i = 0; i < previewsCount; i++) {
        if (this.previews[i] && this.previews[i].vk) {
          this.previews.splice(i)
        }
      }
      this.previews.push(...this.vkFiles)
    }
  }
  deleteVkFiles(file: any) {
    this.deleteVkfilesEmit.emit(file)
  }
  fileChanged(event: any, inputBlock: any) {
    // Преобразуем FileList в обычный массив
    let filesArray: File[] = Array.from(event.target.files)

    // Создаем массив промисов
    let promises = filesArray.map((file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          if (this.files.map((e) => e.name).indexOf(file.name) === -1) {
            this.previews.push({
              link: e.target.result,
              name: file.name,
            })

            this.files.push(file)
          } else {
            this.toastService.showToast('Файл уже загружен!', 'warning')
          }
          resolve()
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsDataURL(file)
      })
    })

    // Дожидаемся завершения всех промисов
    Promise.all(promises)
      .then(() => {
        event.target.value = null
        this.filesEmit.emit(this.files)
      })
      .catch((error) => {
        console.error('Error reading files', error)
      })
  }

  setMainPhoto(event: any) {
    if (event.target.style.backgroundImage) {
      this.mainPhoto.nativeElement.style.backgroundImage = event.target.style.backgroundImage
    }
  }

  deletePreview(file: any, i: number) {
    if (!file.vk) {
      if (file.id) {
        this.previews = this.previews.filter((fileArrayItem) => fileArrayItem.id !== file.id)
        this.files.find((fileArrayItem) => fileArrayItem.id === file.id).on_delete = true
        this.filesEmit.emit(this.files)
      } else {
        let index = this.files.map((e) => e.name).indexOf(file.name)
        let previewsIndex = this.files.find((fileArrayItem) => fileArrayItem.name === file.name)
        this.files = this.files.filter((fileArrayItem) => fileArrayItem.name !== file.name)
        this.previews = this.previews.filter((fileArrayItem) => fileArrayItem.name !== file.name)
        this.filesEmit.emit(this.files)
      }
    } else {
      let previewsIndex = this.vkFiles.find((fileArrayItem) => fileArrayItem.name === file.name)
      if (previewsIndex) {
        this.deleteVkFiles(file)
        this.previews = this.previews.filter((fileArrayItem) => fileArrayItem.name !== file.name)
      }
    }
  }

  ngOnInit() {
    if (this.files) {
      this.files.forEach((file) => {
        let link = this.fileService.checkLinkFile(file)
        if (link !== '') this.previews.push({ id: file.id, link: link, name: file.name })
      })
    }
  }
}
