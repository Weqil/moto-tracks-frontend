import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}
  backendUrl: string = `${environment.BACKEND_URL}:${environment.BACKEND_PORT}`
  checkLinkFile(file: any): string {
    if (file && file.link.includes('https')) {
      return file.link
    } else {
      return `${this.backendUrl}${file.link}`
    }
  }
  checkLinkString(string: string): string {
    if (string && string.includes('https')) {
      return string
    } else {
      return `${this.backendUrl}${string}`
    }
  }

  hasFileType(filename: string) {
    if (filename.lastIndexOf('.')) {
      const lastDotIndex = filename.lastIndexOf('.')
      return lastDotIndex > 0 && lastDotIndex < filename.length - 1
    } else {
      return false
    }
  }
}
