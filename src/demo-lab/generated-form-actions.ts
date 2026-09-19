import {Injectable, signal, Signal} from '@angular/core';
import {FieldTree, submit} from '@angular/forms/signals';
@Injectable()
export class GeneratedFormActions {
  readonly saved = signal<Record<string, string> | null>(null);
  async save(event: Event, fields: FieldTree<Record<string, string>>, model: Signal<Record<string, string>>) {
    event.preventDefault();
    await submit(fields, {
      onInvalid: (f) => f().errorSummary()[0]?.fieldTree().focusBoundControl(),
      action: async () => {
        this.saved.set({ ...model() });
      },
    });
  }
}
