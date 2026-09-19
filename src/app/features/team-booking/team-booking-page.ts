import {Component} from '@angular/core';
import {TeamBookingForm} from './team-booking-form';
@Component({
  selector:'app-team-booking-page',imports:[TeamBookingForm],
  templateUrl:'./team-booking-page.html',
  styleUrls:['./team-booking.css','./team-booking-page.css'],
})
export class TeamBookingPage {}
