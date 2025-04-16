import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ButtonsModule } from '@app/Shared/Modules/buttons/buttons.module';

@Component({
  selector: 'app-upload-file-input',
  templateUrl: './upload-file-input.component.html',
  styleUrls: ['./upload-file-input.component.scss'],
  imports:[NgClass,ButtonsModule,CommonModule]
})
export class UploadFileInputComponent  implements OnInit {

  constructor() { }
  @Input() resultsFilesUpload:[
    {
      file:File,
      localPath:string,
      type?:string;
    }
  ]|any = []
  @Input() allowedTypes:string[] = []
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() clearUploadFiles:boolean = false
  @Output() resultsFilesUploadEmit:EventEmitter<any> = new EventEmitter() 
  isDragOver = false;
  onDragOver(event: DragEvent) {
    event.preventDefault(); 
    this.isDragOver = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
   
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    this.isDragOver = false;
  }
  deleteUploudResultFile(file:any){
    this.resultsFilesUpload = this.resultsFilesUpload.filter((uploadFile:any)=> uploadFile.localPath !== file.localPath)
    this.resultsFilesUploadEmit.emit(this.resultsFilesUpload)
  }

  getResultFile(event:any){
    this.isDragOver = false;
    const input = event.target as HTMLInputElement;
   
    if (input.files) {
      const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      };
      
      const files = Array.from(input.files);
      const readTasks: Promise<void>[] = [];
      
      files.forEach(file => {
        if (!this.allowedTypes.includes(file.type) && this.allowedTypes.length) {
          console.warn('Неподдерживаемый тип файла:', file.name, file.type);
          return;
        }
      
        const isDuplicate = this.resultsFilesUpload.some((existing: any) =>
          existing.file.name === file.name &&
          existing.file.size === file.size &&
          existing.file.lastModified === file.lastModified
        );
      
        if (!isDuplicate) {
          const task = readFileAsDataURL(file).then(result => {
            this.resultsFilesUpload.push({
              file,
              localPath: result,
              type: file.type
            });
          });
          readTasks.push(task);
        }
        this.fileInput.nativeElement.value = '';
      });
      
      // Дождаться завершения всех FileReader задач
      Promise.all(readTasks).then(() => {
        this.resultsFilesUploadEmit.emit(this.resultsFilesUpload);
      });
    }}

  ngOnInit() {}
  
}
