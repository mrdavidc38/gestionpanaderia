import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

// Workaround for restricted environments where window.fetch is read-only
// prevents "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (descriptor && !descriptor.writable && !descriptor.set) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: () => { /* Prevent error on assignment */ },
      configurable: true
    });
  }
} catch (e) {
  console.warn('Could not apply fetch workaround', e);
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
