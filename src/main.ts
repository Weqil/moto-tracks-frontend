import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";
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

bootstrapApplication(AppComponent, {
  providers: [
        provideAnimations(),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(publicRoutes),
        provideRouter(privateRoutes),
        provideRouter(authRoutes),
        provideRouter(errorsRoutes),
        NG_EVENT_PLUGINS,
        NG_EVENT_PLUGINS
    ],
});
