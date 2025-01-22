import { animate, keyframes, state, style, transition, trigger } from '@angular/animations'
import { NgClass } from '@angular/common'
import {
  Component,
  OnChanges,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { SwitchTypeService } from 'src/app/Shared/Services/switch-type.service'


@Component({
  selector: 'app-type-swither',
  templateUrl: './type-swither.component.html',
  styleUrls: ['./type-swither.component.scss'],
  imports: [NgClass]
})
export class TypeSwitherComponent implements OnInit, OnChanges {
  private readonly destroy$ = new Subject<void>()
  constructor(
    private switchTypeService: SwitchTypeService,
    private router: Router,
  ) {}
  type: string = ''
  sight: string = 'sights'
  event: string = 'events'
  wait: boolean = false

  @Input() redirect!: boolean
  @Output() endingSwitchAnimation: EventEmitter<any> = new EventEmitter()
  @ViewChild('switcher') switcher!: ElementRef
  @ViewChild('itemFirstText') itemFirstText!: ElementRef
  @ViewChild('itemFirstImg') itemFirstImg!: ElementRef
  @ViewChild('itemSecond') itemSecond!: ElementRef
  @ViewChild('itemSecondImg') itemSecondImg!: ElementRef
  @ViewChild('itemSecondText') itemSecondText!: ElementRef
  switcherClass: string = ''
  render(
    switcher: HTMLElement,
    itemFirstText: HTMLElement,
    itemFirstImg: HTMLElement,
    itemSecond: HTMLElement,
    itemSecondImg: HTMLElement,
    itemSecondText: HTMLElement,
  ) {
    if (this.switchTypeService.currentType.value === this.sight) {
      this.switcherClass = 'switcher_second'
      switcher.style.width = '7rem'
      itemFirstText.style.opacity = '0'
      itemFirstText.style.transform = 'translate(5rem)'
      itemFirstImg.classList.add('fire_non-active')
      itemSecond.style.transform = 'translate(-3.5rem)'
      itemSecondImg.classList.add('flag_active')
      itemSecondText.style.opacity = '1'
    } else if (this.switchTypeService.currentType.value === this.event) {
      this.switcherClass = 'switcher_first'
      itemSecondText ? (itemSecondText.style.opacity = '0') : null
      switcher ? (switcher.style.width = '8rem') : null
      itemFirstImg ? itemFirstImg.classList.remove('fire_non-active') : null
      itemSecond ? (itemSecond.style.transform = 'translate(0rem)') : null
      itemFirstText ? (itemFirstText.style.opacity = '1') : null

      setTimeout(() => {
        itemFirstText ? (itemFirstText.style.transform = 'translate(0rem)') : null
      }, 100)

      itemSecondImg ? itemSecondImg.classList.remove('flag_active') : null
    }
  }
  switchType(
    switcher: HTMLElement,
    itemFirstText: HTMLElement,
    itemFirstImg: HTMLElement,
    itemSecond: HTMLElement,
    itemSecondImg: HTMLElement,
    itemSecondText: HTMLElement,
  ) {
    if (!this.wait) {
      this.wait = true
      this.switchTypeService.changeType()
      setTimeout(() => {
        this.endingSwitchAnimation.emit()
        this.wait = false
      }, 300)
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.render(
      this.switcher?.nativeElement,
      this.itemFirstText?.nativeElement,
      this.itemFirstImg?.nativeElement,
      this.itemSecond?.nativeElement,
      this.itemSecondImg?.nativeElement,
      this.itemSecondText?.nativeElement,
    )
  }
  ionViewDidEnter() {}
  ngAfterViewInit() {
    this.render(
      this.switcher?.nativeElement,
      this.itemFirstText?.nativeElement,
      this.itemFirstImg?.nativeElement,
      this.itemSecond?.nativeElement,
      this.itemSecondImg?.nativeElement,
      this.itemSecondText?.nativeElement,
    )
  }

  ngOnInit() {
    if (this.router.url != '/tracks') {
      this.switchTypeService.currentType.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        this.type = value
        if (
          this.switcher &&
          this.itemFirstText &&
          this.itemFirstImg &&
          this.itemSecond &&
          this.itemSecondText &&
          this.itemSecondImg
        ) {
          this.render(
            this.switcher.nativeElement,
            this.itemFirstText.nativeElement,
            this.itemFirstImg.nativeElement,
            this.itemSecond.nativeElement,
            this.itemSecondImg.nativeElement,
            this.itemSecondText.nativeElement,
          )
        } else {
        }
      })
    } else {
      this.switchTypeService.currentType.next('sights')
      // this.switchTypeService.currentType.next(this.sight)
      this.switchTypeService.currentType.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        this.type = value
        if (
          this.switcher &&
          this.itemFirstText &&
          this.itemFirstImg &&
          this.itemSecond &&
          this.itemSecondText &&
          this.itemSecondImg
        ) {
          this.render(
            this.switcher.nativeElement,
            this.itemFirstText.nativeElement,
            this.itemFirstImg.nativeElement,
            this.itemSecond.nativeElement,
            this.itemSecondImg.nativeElement,
            this.itemSecondText.nativeElement,
          )
        } else {
        }
      })
    }
  }
}
