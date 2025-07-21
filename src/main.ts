import { provideAnimations } from '@angular/platform-browser/animations'
import { bootstrapApplication } from '@angular/platform-browser'
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router'
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone'
import { publicRoutes } from './app/Routes/public.routes'
import { routes } from './app/app.routes'
import { privateRoutes } from './app/Routes/private.routes'
import { AppComponent } from './app/app.component'
import { errorsRoutes } from './app/Routes/errors.routes'
import { authRoutes } from './app/Routes/auth.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { authTokenInterceptor } from './app/Shared/Data/Interceptors/auth.interceptor'
import { YaConfig } from 'angular8-yandex-maps/lib/interfaces/ya-config'
import { environment } from './environments/environment'
import { importProvidersFrom, inject, LOCALE_ID, provideAppInitializer } from '@angular/core'
import { AngularYandexMapsModule } from 'angular8-yandex-maps'
import config from 'capacitor.config'
import { MetrikaModule } from 'ng-yandex-metrika'
import { YandexMetrikaModule } from './app/Shared/Modules/yandex-metrika/yandex-metrika.module'
import { registerLocaleData } from '@angular/common'
import localeRu from '@angular/common/locales/ru'
import { contentTypeInterceptorFn } from '@app/Shared/Data/Interceptors/contentType.interceptor'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideMessaging, getMessaging } from '@angular/fire/messaging'
import { UserService } from '@app/Shared/Data/Services/User/user.service'
import { finalize, firstValueFrom, forkJoin, from, map, Observable, tap, toArray } from 'rxjs'
import { LoadingService } from '@app/Shared/Services/loading.service'
import { comissionsRoutes } from '@app/Routes/comissions.routes'
import { MapService } from '@app/Shared/Data/Services/Map/map.service'

const yandexMapConfig: YaConfig = {
  apikey: environment.apiKeyYandex + '&' + `suggest_apikey=${environment.apiKeyYandexSubject}`,
}
const allAppRoutes = [...publicRoutes, ...comissionsRoutes, ...privateRoutes, ...authRoutes, ...errorsRoutes]
registerLocaleData(localeRu, 'ru')
bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => {
      const loadingService = inject(LoadingService)
      const mapService = inject(MapService)
      const userService = inject(UserService)

      function getRoles(): Observable<any> {
        return userService.getChangeRoles().pipe(
          tap((res: any) => {
            userService.allRoles = res.role
          }),
        )
      }

      function getRegions(): Observable<any> {
        return mapService.getAllRegions(false, false, false).pipe(
          map((res: any) =>
            res.data.map((region: any) => ({
              name: `${region.name} ${region.type}`,
              value: region.id,
            })),
          ),
          tap((regions: { name: string; value: string }[]) => {
            mapService.allRegions.next(regions)
          }),
        )
      }
      return loadingService.showLoading().then((loader: HTMLIonLoadingElement) => {
        return firstValueFrom(forkJoin([getRoles(), getRegions()])).then(() => loadingService.hideLoading(loader))
      })
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),
    provideAnimations(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    { provide: LOCALE_ID, useValue: 'ru' },
    provideRouter(allAppRoutes, withPreloading(PreloadAllModules)),
    importProvidersFrom(MetrikaModule.forRoot([{ id: environment.metrikaId, webvisor: true }, { id: environment.metrikaId }])),
    importProvidersFrom(AngularYandexMapsModule.forRoot(yandexMapConfig)),
    provideHttpClient(withInterceptors([authTokenInterceptor, contentTypeInterceptorFn])),
  ],
})
