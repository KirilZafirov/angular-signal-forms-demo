import {Component, inject, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {initialRegistration, registrationSchema} from './registration';
import {FormFieldComponent} from '../../shared/form-field';
import {BookingActions} from './booking-actions';

@Component({
  selector: 'app-team-booking-form',
  imports: [FormField, JsonPipe, FormFieldComponent],
  providers: [BookingActions],
  templateUrl: './team-booking-form.html',
  styleUrls: ['./team-booking.css', './team-booking-form.css'],
})
export class TeamBookingForm {
  readonly mealOptions = [{value: 'standard', label: 'Standard'}, {value: 'vegetarian', label: 'Vegetarian'}, {value: 'vegan', label: 'Vegan'}];
  readonly model = signal(initialRegistration());
  readonly registration = form(this.model, registrationSchema);
  readonly actions = inject(BookingActions).connect(this.model, this.registration);
}
