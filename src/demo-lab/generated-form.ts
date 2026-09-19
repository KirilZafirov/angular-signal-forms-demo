import { Component, input, signal, inject, Injector, runInInjectionContext } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, required, email, Schema } from '@angular/forms/signals';
import {GeneratedFormActions} from './generated-form-actions';
import { FormDefinition } from './description';
import {FormFieldComponent} from '../app/shared/form-field';
@Component({
  selector: 'app-generated-form',
  imports: [FormFieldComponent, JsonPipe],
  providers: [GeneratedFormActions],
  styleUrl: './lab.css',
  templateUrl: './generated-form.html',
})
export class GeneratedForm {
  // Each generation mounts a fresh component, so its form and resources share a lifetime.
  readonly definition = input.required<FormDefinition>();
  readonly initialValues = input<Record<string, string>>({});
  readonly validationSchema = input<Schema<Record<string, string>>>();
  readonly title = input('Your generated form');
  readonly model = signal<Record<string, string>>({});
  readonly actions = inject(GeneratedFormActions);
  private readonly injector = inject(Injector);
  fields!: ReturnType<typeof form<Record<string, string>>>;
  ngOnInit() {
    this.model.set(Object.fromEntries(this.definition().fields.map((f) => [f.key, this.initialValues()[f.key] ?? ''])));
    this.fields = runInInjectionContext(this.injector, () =>
      form(this.model, this.validationSchema() ?? ((p) => {
        for (const item of this.definition().fields) {
          if (item.required)
            required(p[item.key], { message: 'Enter ' + item.label.toLowerCase() + '.' });
          if (item.kind === 'email') email(p[item.key], { message: 'Use a valid email address.' });
        }
      })),
    );
  }
}
