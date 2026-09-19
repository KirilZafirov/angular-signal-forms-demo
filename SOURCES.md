# Version and API sources
Verified against official pages and installed packages on September 18, 2026.

- https://angular.dev/api/forms/signals/form — stable since v22.0, writable model as source of truth.
- https://angular.dev/api/forms/signals/submit — action options, fieldTree error routing, concurrent submission prevention.
- https://angular.dev/guide/forms/signals/form-submission — onInvalid, submitting, pending validation policy and error clearing on edit.
- https://angular.dev/guide/forms/signals/form-logic — hidden is schema state; render with @if. Explicit payload mapping remains a feature decision.
- https://angular.dev/guide/forms/signals/validation — schema rules and field state.
- https://angular.dev/reference/versions — version compatibility.

Demo pins Angular and CLI 22.1.7, Node 22.22.3. The preinstalled CLI 21.2.15 and Node 22.21.1 were not used to compile the demo. Current unversioned docs can change. Installed declarations, tests and lockfile are the final check for this demo.

Nested model and arrays:
- https://angular.dev/guide/forms/signals/models — plain nested objects/arrays and form field trees.
- https://angular.dev/api/forms/signals/applyEach — rules for each array entry.
Stable identity, row removal, server correlation and hidden nested-group behavior are verified against installed Angular 22.1.7 by the supplied tests.
