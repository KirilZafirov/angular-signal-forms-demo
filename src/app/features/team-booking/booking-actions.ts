import {Injectable, computed, inject, signal, afterNextRender, Injector, WritableSignal} from '@angular/core';
import {FieldTree, submit} from '@angular/forms/signals';
import {Registration, toPayload, newAttendee} from './registration';
import {RegistrationApi, Scenario} from './registration-api';

type Outcome =
  | { kind: 'idle' }
  | { kind: 'failed'; message: string }
  | { kind: 'rejected'; attendeeId: string }
  | { kind: 'saved'; reference: string; snapshot: string };

// Provided by TeamBookingForm: each form instance owns its workflow state.
@Injectable()
export class BookingActions {
  readonly api = inject(RegistrationApi);
  private readonly injector = inject(Injector);
  private model!: WritableSignal<Registration>;
  private registration!: FieldTree<Registration>;

  connect(model: WritableSignal<Registration>, registration: FieldTree<Registration>) {
    this.model = model;
    this.registration = registration;
    return this;
  }
  readonly outcome = signal<Outcome>({ kind: 'idle' });
  readonly structureMessage = signal('');
  private nextId = 2;
  readonly message = computed(() => {
    if (this.registration().submitting()) return 'Saving your reservation…';
    const result = this.outcome();
    if (result.kind === 'saved')
      return JSON.stringify(toPayload(this.model())) === result.snapshot
        ? `Reservation confirmed. Reference ${result.reference}.`
        : `Reservation ${result.reference} was confirmed. Your current edits have not been saved.`;
    if (result.kind === 'failed') return result.message;
    if (result.kind === 'rejected') {
      const index = this.model().attendees.findIndex((a) => a.id === result.attendeeId);
      if (index < 0) return 'The rejected attendee was removed. Submit the updated booking.';
      return this.registration.attendees[index]
        .email()
        .errors()
        .some((e) => e.kind === 'duplicate')
        ? `The server rejected attendee ${index + 1}. Review their email.`
        : 'The attendee email changed. Submit again to confirm.';
    }
    return '';
  });
  addAttendee() {
    if (this.registration().submitting()) return;
    const attendee = newAttendee(`attendee-${this.nextId++}`);
    this.model.update((v) => ({ ...v, attendees: [...v.attendees, attendee] }));
    this.structureMessage.set('Attendee added. Enter their details.');
    afterNextRender(
      () =>
        this.registration.attendees[this.model().attendees.length - 1].name().focusBoundControl(),
      { injector: this.injector },
    );
  }
  removeAttendee(id: string) {
    if (this.registration().submitting() || this.model().attendees.length <= 1) return;
    const index = this.model().attendees.findIndex((a) => a.id === id);
    if (index < 0) return;
    this.model.update((v) => ({ ...v, attendees: v.attendees.filter((a) => a.id !== id) }));
    this.structureMessage.set('Attendee removed.');
    afterNextRender(
      () =>
        this.registration.attendees[Math.min(index, this.model().attendees.length - 1)]
          .name()
          .focusBoundControl(),
      { injector: this.injector },
    );
  }
  setScenario(event: Event) {
    this.api.scenario.set((event.target as HTMLSelectElement).value as Scenario);
  }
  async save(event: Event) {
    event.preventDefault();
    if (this.registration().submitting()) return;

    this.outcome.set({ kind: 'idle' });
    try {
      await submit(this.registration, {
        ignoreValidators: 'none',
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
        action: async (field) => {
          // Snapshot once; the fieldset locks editing until the action settles.
          const payload = toPayload(this.model());
          try {
            const result = await this.api.save(payload);
            if (result.kind === 'rejected') {
              const index = this.model().attendees.findIndex((a) => a.id === result.attendeeId);
              if (index < 0) throw new Error('Unknown attendee in server response');
              this.outcome.set({ kind: 'rejected', attendeeId: result.attendeeId });
              return {
                fieldTree: field.attendees[index].email,
                kind: 'duplicate',
                message: result.message,
              };
            }
            this.outcome.set({
              kind: 'saved',
              reference: result.reference,
              snapshot: JSON.stringify(payload),
            });
            return undefined;
          } catch {
            this.outcome.set({
              kind: 'failed',
              message:
                'Could not confirm the reservation. Your entries are preserved. Retry when ready.',
            });
            // Transport failure is request state, not a field validation error.
            throw new Error('Reservation request failed');
          }
        },
      });
    } catch {
      // The action recorded failure. submit() releases submitting in its finally block.
    }
    // Client invalid focus is handled by onInvalid. Server errors arrive later.
    const result = this.outcome();
    if (result.kind === 'rejected') {
      afterNextRender(
        () => {
          const index = this.model().attendees.findIndex((a) => a.id === result.attendeeId);
          if (index >= 0) this.registration.attendees[index].email().focusBoundControl();
        },
        { injector: this.injector },
      );
    }
  }
}
