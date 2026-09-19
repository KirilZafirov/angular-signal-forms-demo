import {DynamicPage} from '../demo-lab/dynamic-page';
import {Routes} from '@angular/router';
import {TeamBookingPage} from './features/team-booking/team-booking-page';
import {Builder} from '../demo-lab/builder';
import {Comparison} from '../demo-lab/comparison';
export const demoRoutes: Routes = [
  {path:'',component:TeamBookingPage,pathMatch:'full'},
  {path:'form-builder',component:Builder},
  {path:'dynamic-form',component:DynamicPage},
  {path:'comparison',component:Comparison},
  {path:'**',redirectTo:''},
];
