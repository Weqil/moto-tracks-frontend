import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class NoDataFoundComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Данные не найдены';

  constructor() {
    addIcons({ alertCircleOutline });
  }
} 