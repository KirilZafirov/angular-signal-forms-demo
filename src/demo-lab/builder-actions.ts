import {Injectable, signal, WritableSignal} from '@angular/core';
import {interpretDescription, FormDefinition} from './description';
@Injectable()
export class BuilderActions {
  readonly generations = signal<{ id: number; definition: FormDefinition }[]>([]);
  readonly error = signal('');
  readonly status = signal('');
  private revision = 0;
  generate(description: string) {
    this.error.set('');
    this.status.set('');
    try {
      const definition = interpretDescription(description);
      this.generations.set([{ id: ++this.revision, definition }]);
      this.status.set(
        'Built ' + definition.fields.length + ' fields. Review the definition against your brief.',
      );
    } catch (e) {
      this.error.set((e as Error).message);
    }
  }
  example(description: WritableSignal<string>) {
    description.set(
      'Create a contact form with name, email, phone, city, and optional message.',
    );
  }
}
