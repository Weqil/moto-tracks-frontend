пimport { Injectable } from '@angular/core'
import { PDFDocument, rgb } from 'pdf-lib'

@Injectable({
  providedIn: 'root',
})
export class PdfUniteService {
  constructor() {}

  /**
   * Объединяет массив файлов (pdf или изображения) в один PDF
   * @param files File[] - массив файлов (pdf или изображения)
   * @returns Promise<File> - итоговый PDF файл
   */
  async uniteFilesToPdf(files: File[], fileName: string = 'document'): Promise<File> {
    if (!files.length) throw new Error('Нет файлов для объединения')

    // Проверяем типы файлов
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
    const allowedPdfType = 'application/pdf'
    for (const file of files) {
      if (file.type !== allowedPdfType && !allowedImageTypes.includes(file.type)) {
        throw new Error('Можно объединять только PDF или изображения')
      }
    }

    // Создаём новый PDF
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      if (file.type === allowedPdfType) {
        // Если это PDF, импортируем все страницы
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      } else if (allowedImageTypes.includes(file.type)) {
        // Если это изображение, добавляем как страницу
        let image, dims
        if (file.type === 'image/jpeg') {
          image = await mergedPdf.embedJpg(arrayBuffer)
          dims = image.scale(1)
        } else {
          image = await mergedPdf.embedPng(arrayBuffer)
          dims = image.scale(1)
        }
        const page = mergedPdf.addPage([dims.width, dims.height])
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        })
      }
    }

    const pdfBytes = await mergedPdf.save()
    // Возвращаем как File
    return new File([pdfBytes], `${fileName}.pdf`, { type: 'application/pdf' })
  }

  downloadFile(file: File) {
    console.log(file)
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name // имя файла, например merged.pdf
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }
}
