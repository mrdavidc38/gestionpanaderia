import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {provideEntityData, withEffects} from '@ngrx/data';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {importProvidersFrom} from '@angular/core';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {MockDbService} from './mock-db.service';
import {entityConfig} from './infrastructure/ngrx-data-config';
import {provideNativeDateAdapter} from '@angular/material/core';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({}),
    provideEffects([]),
    provideEntityData(entityConfig, withEffects()),
    provideNativeDateAdapter(),
    importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(MockDbService, { delay: 500, dataEncapsulation: false })),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ],
};
