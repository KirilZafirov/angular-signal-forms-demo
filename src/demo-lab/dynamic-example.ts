import {schema, required, email} from '@angular/forms/signals';
import {FormDefinition} from './description';

// Plain JSON describes presentation. No HTML or code is evaluated.
export const contactDefinition: FormDefinition = {
  fields: [
    {key: 'name', label: 'Full name', kind: 'text', required: true},
    {key: 'email', label: 'Email', kind: 'email', required: true},
    {key: 'city', label: 'City', kind: 'text', required: true},
    {key: 'topic', label: 'Topic', kind: 'select', required: true, options: [
      {value: '', label: 'Choose a topic'},
      {value: 'workshop', label: 'Workshop'},
      {value: 'speaking', label: 'Speaking'},
    ]},
    {key: 'notes', label: 'Notes', kind: 'textarea', required: false},
  ],
};
export const contactValues: Record<string, string> = {
  name: '', email: '', city: 'Skopje', topic: '', notes: '',
};
// Angular schema is trusted application code, separate from the JSON UI definition.
export const contactSchema = schema<Record<string, string>>(p => {
  required(p['name'], {message: 'Enter full name.'});
  required(p['email'], {message: 'Enter email.'});
  email(p['email'], {message: 'Use a valid email address.'});
  required(p['city'], {message: 'Enter city.'});
  required(p['topic'], {message: 'Choose a topic.'});
});
