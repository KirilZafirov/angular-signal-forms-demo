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
  // Array-level rule: validate the team itself, even when there are no people.
  validate(p.attendees, ({value}) => value().length < 1 ? {kind: 'minimum', message: 'Add at least one attendee.'} : undefined);
  // Apply these field rules to every attendee, including newly added rows.
  // `person` describes one item's schema paths; it is not an attendee value.
  applyEach(p.attendees, (person) => {
    // Custom messages belong to the field's errors. Our shared field component
    // displays them after touch or an attempted submission.
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
