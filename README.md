# Angular Signal Forms demo — TWS /2026

A small Angular 22 demo exploring explicit forms, reusable controls and configuration-driven forms. The extended team-booking checkpoint is loaded by default.

## Run locally

Use Node 22.22.3 (see `.nvmrc`), then:

```sh
npm ci
npm start
```

Open http://localhost:4200.

## Demo pages

- `/` — nested team booking, dynamic attendees, conditional billing, validation, server rejection and retry.
- `/form-builder` — a bounded offline description interpreter feeding a shared renderer. This is not a connected AI service; unsupported fields are not interpreted.
- `/dynamic-form` — a small form rendered from a JSON UI definition, initial values and a separate Angular validation schema.
- `/comparison` — Reactive Forms / Signal Forms teaching excerpts.

Light and dark themes are available in the sticky navigation.

## Code tour

- `src/app/app.ts` and `app.routes.ts`: application shell and routes.
- `src/app/features/team-booking/`: page, form, schema, payload mapping and component-scoped `BookingActions` service.
- `src/app/shared/form-field.ts`: reusable input, textarea and select with accessible labels and errors.
- `src/demo-lab/dynamic-example.ts`: edit the dynamic form definition, values and schema here.
- `src/demo-lab/generated-form.ts`: shared dynamic renderer; submission is in `GeneratedFormActions`.
- `src/demo-lab/builder-actions.ts`: description interpretation and generation state.

The form components keep model/schema setup visible; workflow services handle submission and other actions.

## Checkpoints and verification

```sh
npm run checkpoint -- core
npm run checkpoint -- extended
npm test -- --watch=false
npm run build
```

Switching checkpoints backs up `src/app` to `.checkpoint-backups`. Core has organizer and attendees; extended adds deep company billing. The other demo pages stay available. `AGENT-PROMPT.md` contains the bounded live coding exercise; `AGENTS.md` describes its constraints.

The production build is generated into `dist/`. After building, `node scripts/serve-built.mjs` serves it at http://127.0.0.1:4201 with route fallback. Dependencies and compiled output are not included in Git.

## Demo boundaries

API responses are simulated in memory. No real registrations, payments, credentials or backend are used. Submission snapshots stay on the device. The description interpreter supports a limited vocabulary. The dynamic renderer supports flat string-valued fields, while the explicit booking demonstrates nested groups and arrays. Client validation does not replace server validation.

Official Angular references are in `SOURCES.md`.
