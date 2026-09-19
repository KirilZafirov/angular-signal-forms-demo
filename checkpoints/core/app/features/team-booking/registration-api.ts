import {Injectable, signal} from '@angular/core';
import {toPayload} from './registration';
export type Scenario = 'success' | 'rejected' | 'offline';
export type SaveResult = {kind: 'saved'; reference: string} | {kind: 'rejected'; attendeeId: string; message: string};

// Deterministic simulation. IDs correlate responses to submitted attendees, not display positions.
@Injectable({providedIn: 'root'})
export class RegistrationApi {
  readonly scenario = signal<Scenario>('success');
  readonly calls = signal(0);
  readonly lastPayload = signal<ReturnType<typeof toPayload> | null>(null);
  async save(payload: ReturnType<typeof toPayload>): Promise<SaveResult> {
    const scenario = this.scenario();
    this.calls.update(n => n + 1);
    this.lastPayload.set(structuredClone(payload));
    await new Promise(resolve => setTimeout(resolve, 900));
    if (scenario === 'offline') throw new Error('Simulated connection failure');
    if (scenario === 'rejected') {
      const target = payload.attendees[1] ?? payload.attendees[0];
      return {kind: 'rejected', attendeeId: target.clientId, message: 'This attendee already has a reservation. Use another email.'};
    }
    return {kind: 'saved', reference: 'AM-TEAM-042'};
  }
}
