import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppGlobal } from './app/app.global';

if (environment.production) {
  enableProdMode();
}

var loader = new THREE.FontLoader();
loader.load( '/libs/fonts/helvetiker_regular_typeface.json', function ( font ) {
  AppGlobal.labelFont = font;
  platformBrowserDynamic().bootstrapModule(AppModule);
});

