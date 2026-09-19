import { schema, required, email, hidden, applyEach, validate } from '@angular/forms/signals';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  preferences: { meal: string; accessibilityNotes: string };
}
export interface Registration {
  organizer: { name: string; email: string };
  attendees: Attendee[];
  billing: {
    companyInvoice: boolean;
    company: {
      name: string;
      address: { street: string; city: string; postalCode: string; country: string };
    };
  };
}
export const newAttendee = (id: string): Attendee => ({
  id,
  name: '',
  email: '',
  preferences: { meal: 'standard', accessibilityNotes: '' },
});
export const initialRegistration = (): Registration => ({
  organizer: { name: '', email: '' },
  attendees: [newAttendee('attendee-1')],
  billing: {
    companyInvoice: false,
    company: { name: '', address: { street: '', city: '', postalCode: '', country: '' } },
  },
});

export const registrationSchema = schema<Registration>((p) => {
  required(p.organizer.name, { message: 'Enter the organizer name.' });
  required(p.organizer.email, { message: 'Enter the organizer email.' });
  email(p.organizer.email, { message: 'Use a valid email address.' });
  // Array-level rule: validate the team itself, even when there are no people.
  validate(p.attendees, ({ value }) =>
    value().length < 1 ? { kind: 'minimum', message: 'Add at least one attendee.' } : undefined,
  );
  // Apply these field rules to every attendee, including newly added rows.
  // `person` describes one item's schema paths; it is not an attendee value.
  applyEach(p.attendees, (person) => {
    // Custom messages belong to the field's errors. Our shared field component
    // displays them after touch or an attempted submission.
    required(person.name, { message: 'Enter the attendee name.' });
    required(person.email, { message: 'Enter the attendee email.' });
    email(person.email, { message: 'Use a valid email address.' });
  });
  hidden(p.billing.company, { when: ({ valueOf }) => !valueOf(p.billing.companyInvoice) });
  required(p.billing.company.name, { message: 'Enter the company name.' });
  required(p.billing.company.address.street, { message: 'Enter the street address.' });
  required(p.billing.company.address.city, { message: 'Enter the city.' });
  required(p.billing.company.address.postalCode, { message: 'Enter the postal code.' });
  required(p.billing.company.address.country, { message: 'Enter the country.' });
});

export function toPayload(value: Registration) {
  const company = value.billing.company;
  return {
    organizer: {
      name: value.organizer.name.trim(),
      email: value.organizer.email.trim().toLowerCase(),
    },
    attendees: value.attendees.map((a) => ({
      clientId: a.id,
      name: a.name.trim(),
      email: a.email.trim().toLowerCase(),
      preferences: {
        ...a.preferences,
        accessibilityNotes: a.preferences.accessibilityNotes.trim(),
      },
    })),
    ...(value.billing.companyInvoice
      ? {
          invoice: {
            companyName: company.name.trim(),
            address: Object.fromEntries(
              Object.entries(company.address).map(([key, val]) => [key, val.trim()]),
            ),
          },
        }
      : {}),
  };
}
