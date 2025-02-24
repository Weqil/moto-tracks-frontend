
import { provideAnimations } from "@angular/platform-browser/animations";
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { publicRoutes } from './app/Routes/public.routes';
import { routes } from './app/app.routes';
import { privateRoutes } from './app/Routes/private.routes';
import { AppComponent } from './app/app.component';
import { errorsRoutes } from './app/Routes/errors.routes';
import { authRoutes } from './app/Routes/auth.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authTokenInterceptor } from "./app/Shared/Data/Interceptors/auth.interceptor";
import { YaConfig } from "angular8-yandex-maps/lib/interfaces/ya-config";
import { environment } from "./environments/environment";
import { importProvidersFrom, LOCALE_ID } from "@angular/core";
import { AngularYandexMapsModule } from "angular8-yandex-maps";
import config from "capacitor.config";
import { MetrikaModule } from "ng-yandex-metrika";
import { YandexMetrikaModule } from "./app/Shared/Modules/yandex-metrika/yandex-metrika.module";

const yandexMapConfig: YaConfig = {
  apikey: environment.apiKeyYandex + '&' + `suggest_apikey=${environment.apiKeyYandexSubject}`,
};

bootstrapApplication(AppComponent, {
  providers: [
        provideAnimations(),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(publicRoutes),
        provideRouter(privateRoutes),
        provideRouter(authRoutes),
        importProvidersFrom(
          MetrikaModule.forRoot([
            { id: environment.metrikaId, webvisor: true,  },
            { id: environment.metrikaId },
          ])
        ),
        provideRouter(errorsRoutes),
        importProvidersFrom(AngularYandexMapsModule.forRoot(yandexMapConfig)),
        provideHttpClient(withInterceptors([authTokenInterceptor])),
    ],
});
