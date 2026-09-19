import {schema, required, email, applyEach, validate} from '@angular/forms/signals';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  preferences: {meal: string; accessibilityNotes: string};
}
export interface Registration {
  organizer: {name: string; email: string};
  attendees: Attendee[];

}
export const newAttendee = (id: string): Attendee => ({id, name: '', email: '', preferences: {meal: 'standard', accessibilityNotes: ''}});
export const initialRegistration = (): Registration => ({
  organizer: {name: '', email: ''},
  attendees: [newAttendee('attendee-1')],
});
export const registrationSchema = schema<Registration>((p) => {
  required(p.organizer.name, {message: 'Enter the organizer name.'});
  required(p.organizer.email, {message: 'Enter the organizer email.'});
  email(p.organizer.email, {message: 'Use a valid email address.'});
  validate(p.attendees, ({value}) => value().length < 1 ? {kind: 'minimum', message: 'Add at least one attendee.'} : undefined);
  applyEach(p.attendees, (person) => {
    required(person.name, {message: 'Enter the attendee name.'});
    required(person.email, {message: 'Enter the attendee email.'});
    email(person.email, {message: 'Use a valid email address.'});
  });
});
export function toPayload(value: Registration) {
  return {
    organizer: {name: value.organizer.name.trim(), email: value.organizer.email.trim().toLowerCase()},
    attendees: value.attendees.map(a => ({clientId: a.id, name: a.name.trim(), email: a.email.trim().toLowerCase(), preferences: {...a.preferences, accessibilityNotes: a.preferences.accessibilityNotes.trim()}})),
  };
}
