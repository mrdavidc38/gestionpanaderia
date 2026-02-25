// Workaround for restricted environments where window.fetch is read-only
// prevents "TypeError: Cannot set property fetch of #<Window> which has only a getter"
// This MUST be at the top to run before any library tries to monkey-patch fetch
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (descriptor && descriptor.configurable && (descriptor.get && !descriptor.set)) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: (v) => { console.warn('Attempted to overwrite fetch', v); },
      configurable: true
    });
  } else if (descriptor && !descriptor.writable && descriptor.configurable) {
    Object.defineProperty(window, 'fetch', {
      writable: true
    });
  }
} catch (e) {
  console.error('Error in fetch workaround', e);
}

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
