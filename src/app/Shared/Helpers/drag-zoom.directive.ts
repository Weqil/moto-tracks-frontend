import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core'

@Directive({
  selector: '[appDragZoom]',
  standalone: true,
})
export class DragZoomDirective implements OnInit {
  // Входные параметры
  @Input() minScale: number = 0.5
  @Input() maxScale: number = 20
  @Input() dragSpeed: number = 1.5
  @Input() zoomSpeed: number = 0.1
  @Input() enableDrag: boolean = true
  @Input() enableZoom: boolean = true

  // Внутренние переменные для перетаскивания
  private startX: number = 0
  private startY: number = 0
  private scrollLeft: number = 0
  private scrollTop: number = 0
  private isDragging: boolean = false

  // Внутренние переменные для масштабирования
  private currentScale: number = 1

  constructor(private elementRef: ElementRef<HTMLDivElement>) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement
    element.style.cursor = 'grab'
    element.style.userSelect = 'none'
    element.style.overflow = 'auto'
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.enableDrag) return

    const container = this.elementRef.nativeElement
    this.isDragging = true
    this.startX = event.pageX - container.offsetLeft
    this.startY = event.pageY - container.offsetTop
    this.scrollLeft = container.scrollLeft
    this.scrollTop = container.scrollTop
    container.style.cursor = 'grabbing'
    event.preventDefault()
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.enableDrag || !this.isDragging) return

    const container = this.elementRef.nativeElement
    const x = event.pageX - container.offsetLeft
    const y = event.pageY - container.offsetTop
    event.preventDefault()

    const walkX = (x - this.startX) * this.dragSpeed
    const walkY = (y - this.startY) * this.dragSpeed

    container.scrollLeft = this.scrollLeft - walkX
    container.scrollTop = this.scrollTop - walkY
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.enableDrag) return

    this.isDragging = false
    this.elementRef.nativeElement.style.cursor = 'grab'
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    if (!this.enableDrag) return

    if (this.isDragging) {
      this.isDragging = false
      this.elementRef.nativeElement.style.cursor = 'grab'
    }
  }

  // @HostListener('wheel', ['$event'])
  // onWheel(event: WheelEvent): void {
  //   if (!this.enableZoom) return

  //   event.preventDefault()

  //   const container = this.elementRef.nativeElement
  //   const rect = container.getBoundingClientRect()
  //   const mouseX = event.clientX - rect.left
  //   const mouseY = event.clientY - rect.top

  //   const delta = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed
  //   const oldScale = this.currentScale
  //   let newScale = this.currentScale + delta

  //   newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale))

  //   const containerChildren = container.children[0] as HTMLDivElement

  //   if (newScale !== this.currentScale) {
  //     const scrollLeft = container.scrollLeft
  //     const scrollTop = container.scrollTop
  //     const scaleRatio = newScale / oldScale

  //     const newScrollLeft = scrollLeft + mouseX * (scaleRatio - 1)
  //     const newScrollTop = scrollTop + mouseY * (scaleRatio - 1)

  //     this.currentScale = newScale
  //     this.applyScale(containerChildren)

  //     container.scrollLeft = newScrollLeft
  //     container.scrollTop = newScrollTop
  //   }
  // }

  // Поддержка сенсорных устройств
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.enableDrag || event.touches.length !== 1) return

    const touch = event.touches[0]
    const container = this.elementRef.nativeElement

    this.isDragging = true
    this.startX = touch.pageX - container.offsetLeft
    this.startY = touch.pageY - container.offsetTop
    this.scrollLeft = container.scrollLeft
    this.scrollTop = container.scrollTop
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.enableDrag || !this.isDragging || event.touches.length !== 1) return

    const touch = event.touches[0]
    const container = this.elementRef.nativeElement
    const x = touch.pageX - container.offsetLeft
    const y = touch.pageY - container.offsetTop

    const walkX = (x - this.startX) * this.dragSpeed
    const walkY = (y - this.startY) * this.dragSpeed

    container.scrollLeft = this.scrollLeft - walkX
    container.scrollTop = this.scrollTop - walkY

    event.preventDefault()
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.enableDrag) return
    this.isDragging = false
  }

  // Публичные методы для программного управления
  public setScale(scale: number): void {
    const container = this.elementRef.nativeElement
    const containerChildren = container.children[0] as HTMLDivElement

    this.currentScale = Math.max(this.minScale, Math.min(this.maxScale, scale))
    this.applyScale(containerChildren)
  }

  public resetScale(): void {
    this.setScale(1)
  }

  public getCurrentScale(): number {
    return this.currentScale
  }

  private applyScale(container: HTMLElement): void {
    container.style.transform = `scale(${this.currentScale})`
    container.style.transformOrigin = 'center center'
  }
}
