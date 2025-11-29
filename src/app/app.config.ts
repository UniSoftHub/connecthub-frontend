import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';
import { authInterceptor } from './interceptors/auth.interceptor';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';

const loggerConfig = {
  level: environment.production ? NgxLoggerLevel.WARN : NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.ERROR,
  disableConsoleLogging: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor, errorInterceptor, authInterceptor])),

    importProvidersFrom(LoggerModule.forRoot(loggerConfig)),
  ],
};
