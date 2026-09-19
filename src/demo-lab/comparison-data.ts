export const comparisons = [
  {
    "title": "Model & binding",
    "summary": "Same organizer data and validation. Reactive Forms owns a control tree; Signal Forms derives a field tree from a signal model.",
    "before": "const organizer = new FormGroup({\n  name: new FormControl('', {\n    nonNullable: true,\n    validators: [Validators.required]\n  }),\n  email: new FormControl('', {\n    nonNullable: true,\n    validators: [Validators.required, Validators.email]\n  })\n});\n\n<input [formControl]=\"organizer.controls.email\" />\norganizer.controls.email.touched\norganizer.controls.email.errors\norganizer.getRawValue()",
    "after": "readonly model = signal(initialRegistration());\nreadonly registration = form(this.model, registrationSchema);\n\n// Inside registrationSchema:\nrequired(p.organizer.name);\nrequired(p.organizer.email);\nemail(p.organizer.email);\n\n<input [formField]=\"registration.organizer.email\" />\nregistration.organizer.email().touched()\nregistration.organizer.email().errors()\nmodel().organizer"
  },
  {
    "title": "Dynamic attendees",
    "summary": "Both approaches preserve surviving rows. Keep application IDs for server correlation; do not identify a person by their current display index.",
    "before": "const attendees = new FormArray([\n  reactiveAttendee('attendee-1')\n]);\n\nattendees.push(reactiveAttendee(nextId));\n// Guard the last row, then remove by its current index.\nattendees.removeAt(index);\n\n@for (person of attendees.controls; track person) {\n  <input [formControl]=\"person.controls.email\" />\n}\n// Validators are installed in reactiveAttendee().",
    "after": "// Inside the schema:\napplyEach(p.attendees, person => {\n  required(person.name);\n  required(person.email);\n  email(person.email);\n});\n\nmodel.update(v => ({...v,\n  attendees: [...v.attendees, newAttendee(nextId)]\n}));\n\n@for (person of registration.attendees; track person) {\n  <input [formField]=\"person.email\" />\n}\n// Preserve existing row objects when removing a row."
  },
  {
    "title": "Nested billing",
    "summary": "This reference disables inactive Reactive Forms controls; the Signal Forms version hides the field group. Both retain the draft. In both, the template controls visibility and the payload mapper decides what is sent.",
    "before": "const company = booking.controls.billing.controls.company;\n\n// Call when the invoice toggle changes:\nenabled ? company.enable() : company.disable();\n\n@if (booking.controls.billing.controls.companyInvoice.value) {\n  <input [formControl]=\"company.controls.address.controls.city\" />\n}\n\n// Disabled controls are excluded from group.value.\n// getRawValue() retains them for explicit payload mapping.\nconst draft = booking.getRawValue();",
    "after": "hidden(p.billing.company, {\n  when: ({valueOf}) => !valueOf(p.billing.companyInvoice)\n});\nrequired(p.billing.company.address.city);\n\n@if (!registration.billing.company().hidden()) {\n  <input [formField]=\"registration.billing.company.address.city\" />\n}\n\n// Hidden descendants do not block validation.\n// The model retains the draft.\nconst payload = toPayload(model());"
  },
  {
    "title": "Server errors",
    "summary": "Both map the returned attendee ID to the current field. These excerpts omit the request and missing-ID guards. In the booking app, submission also locks edits, preserves retry state and coordinates focus after rendering.",
    "before": "const person = booking.controls.attendees.controls.find(\n  a => a.controls.id.value === result.attendeeId\n);\nif (person) {\n  const control = person.controls.email;\n  control.setErrors({\n    ...control.errors,\n    duplicate: result.message\n  });\n  control.markAsTouched();\n}\n// Feature code manages pending state, invalid-submit\n// feedback, request failures and focus timing.\n// Manually set errors are replaced on validation.",
    "after": "// Return from submit()'s action:\nconst index = model().attendees.findIndex(\n  a => a.id === result.attendeeId\n);\nreturn {\n  fieldTree: field.attendees[index].email,\n  kind: 'duplicate',\n  message: result.message\n};\n// submit() manages submitting and returned errors.\n// Feature code still maps IDs, models transport failure,\n// and focuses the field after it is re-enabled."
  },
  {
    "title": "Description \u2192 form",
    "summary": "Description interpretation is separate from Angular. Either forms API can render the same definition. This offline demo recognizes a small vocabulary; it does not generate or execute TypeScript from user input.",
    "before": "const controls = Object.fromEntries(\n  definition.fields.map(f => [f.key,\n    new FormControl('', {\n      nonNullable: true,\n      validators: [\n        ...(f.required ? [Validators.required] : []),\n        ...(f.kind === 'email' ? [Validators.email] : [])\n      ]\n    })\n  ])\n);\nconst fields = new FormRecord(controls);\n\n<input [formControl]=\"fields.controls[item.key]\" />",
    "after": "const model = signal<Record<string, string>>(\n  Object.fromEntries(definition.fields.map(f => [f.key, '']))\n);\nconst fields = form(model, p => {\n  for (const item of definition.fields) {\n    if (item.required) required(p[item.key]);\n    if (item.kind === 'email') email(p[item.key]);\n  }\n});\n\n<input [formField]=\"fields[item.key]\" />\n\n// A fresh child component owns each generation's form.\n// Destroying the child also releases its form resources."
  }
];
