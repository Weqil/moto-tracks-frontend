import { Component, ContentChildren, ElementRef, Input, OnInit, QueryList } from '@angular/core'
import { StepContainerItemComponent } from '../step-container-item/step-container-item.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-step-container',
  templateUrl: './step-container.component.html',
  styleUrls: ['./step-container.component.scss'],
  imports: [CommonModule]
})
export class StepContainerComponent implements OnInit {
  constructor() {}
  @Input() stepCurrency: number = 1
  @Input() maxStepsCount: number = 4
  @ContentChildren(StepContainerItemComponent, { read: ElementRef }) steps!: QueryList<StepContainerItemComponent> //Получаем из ng-content
  stepsToNative: HTMLElement[] = []
  ngAfterViewInit() {
    this.steps.toArray().forEach((step: any) => {
      this.stepsToNative.push(step.nativeElement)
    })
    this.render()
  }
  ngOnChanges() {
    if (this.stepCurrency <= Number(this.maxStepsCount)) {
      this.render()
    }
  }
  render() {
    this.stepsToNative.forEach((step: HTMLElement) => {
      if (Number(step.getAttribute('stepNum')) == this.stepCurrency) {
        step.style.display = 'block'
      } else {
        step.style.display = 'none'
      }
    })
  }
  ngOnInit() {}
}
