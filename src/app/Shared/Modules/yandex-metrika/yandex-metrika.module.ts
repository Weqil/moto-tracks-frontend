import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetrikaModule } from 'ng-yandex-metrika';


@NgModule({
  imports: [
    MetrikaModule.forRoot(
      { id: 100026583, webvisor: true }, 
      {
        // Для загрузки метрики с другого источника
        alternativeUrl: 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js',
      },
    ),
  ]
})
export class YandexMetrikaModule { }
