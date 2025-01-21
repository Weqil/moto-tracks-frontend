import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-step-container-item',
  templateUrl: './step-container-item.component.html',
  styleUrls: ['./step-container-item.component.scss'],
})
export class StepContainerItemComponent implements OnInit {
  @Input() stepCurrency!: number
  @Input() maxStepsCount!: number
  constructor() {}

  ngOnInit() {}
}
