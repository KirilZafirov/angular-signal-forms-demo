Extend this team workshop booking with optional nested company billing.

Read AGENTS.md, package.json and the current schema, template, submission code and tests. Confirm the installed Angular version and describe your intended edits before changing code.

Add billing:{companyInvoice:boolean,company:{name:string,address:{street:string,city:string,postalCode:string,country:string}}}. Initialize the checkbox false and all strings empty. Use Signal Forms hidden state on the company group, with matching @if rendering. Require company name and all address fields only while the group is visible. Keep country/postal rules deliberately generic for this demo; do not invent country-specific formats.

Retain the nested billing draft when switched off, but omit invoice entirely from toPayload. When enabled, submit invoice:{companyName,address:{street,city,postalCode,country}} with trimmed values. Add explicit labels, stable described error IDs and the existing FieldErrors presentation.

Preserve organizer and attendee behavior, stable row identity, server errors mapped by attendee ID, submitting locks, unchanged retry and focus coordination. Do not alter the API adapter or checkpoints. Do not add packages or upgrade Angular. Add tests for deep required fields, hidden-group validity, retained address draft and omitted invoice payload. Run npm test -- --watch=false and npm run build, then show the diff and actual results. Do not read the extended checkpoint as a solution.
