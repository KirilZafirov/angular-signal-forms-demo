import {Component, inject} from '@angular/core';
import {StickyHeader} from './shared/sticky-header';
import {ThemeService} from './shared/theme-service';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
@Component({selector:'app-root',imports:[RouterOutlet,RouterLink,RouterLinkActive,StickyHeader],templateUrl:'./app.html',styleUrl:'./app.css'})
export class App {
  readonly theme = inject(ThemeService);
}
