# Workshop registration context

Read package.json, src/app/features/team-booking/registration.ts, team-booking-form.ts, team-booking-form.html, booking-actions.ts and team-booking-form.spec.ts first.
Angular packages and CLI are pinned to 22.1.7. Use @angular/forms/signals, form(), FormField and [formField]. Verify APIs against installed declarations and the official URLs in SOURCES.md. Do not upgrade packages.

This demo uses a deterministic in-memory API adapter. No real backend, payments, authentication, or registrations.
Keep signal model as source of truth. Schema owns validation. Explicit payload mapping owns what leaves the feature.
A hidden field retains its draft value but must be omitted from the API payload when irrelevant.
Transport failures are request outcomes, not field validation errors. Preserve entries and allow retry without edits. No automatic mutation retries. Server field errors use fieldTree and clear on field edits. Keep submit pending state and duplicate-submit protection. Do not claim real backend idempotency.
Maintain explicit labels, stable error description IDs, touched error timing, visible keyboard focus and polite status announcements. Feature coordinates first-invalid and late server-error focus. Do not disable the submit button solely because the form is invalid.

Run npm test -- --watch=false and npm run build. Report actual results, limitations and files changed. Never invent test success. Do not edit checkpoints or the API adapter to make a test pass.

## Team booking extension
The model now contains organizer, attendees[] and (in the extended checkpoint) billing.company.address. Use applyEach for per-attendee rules. Track the attendee FieldTree in @for and use immutable application IDs for DOM IDs and server correlation. Never use the display index as a server identity. Preserve existing row objects when adding/removing, and block structure changes while submitting. The demo requires at least one attendee. Accessibility notes are optional; use synthetic data only during the talk. The live AI scope is nested billing, not a rewrite of attendee management.
