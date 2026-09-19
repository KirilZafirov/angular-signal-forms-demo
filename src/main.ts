import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {appConfig} from './app/app.config';
import {App} from './app/app';
import {demoRoutes} from './app/app.routes';
bootstrapApplication(App,{...appConfig,providers:[...appConfig.providers,provideRouter(demoRoutes)]}).catch(console.error);
