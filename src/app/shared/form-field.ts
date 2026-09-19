import {Component, computed, input} from '@angular/core';
import {FieldTree, FormField} from '@angular/forms/signals';
import {FieldErrors} from './field-errors';

@Component({
  selector: 'app-form-field',
  imports: [FormField, FieldErrors],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormFieldComponent {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly field = input.required<FieldTree<string>>();
  readonly type = input<'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select'>('text');
  readonly autocomplete = input<string | null>(null);
  readonly rows = input(3);
  readonly options = input<readonly {value: string; label: string}[]>([]);
  readonly errorId = computed(() => this.controlId() + '-errors');
  readonly invalid = computed(() => this.field()().touched() && this.field()().invalid());
}
