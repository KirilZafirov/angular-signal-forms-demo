import {Component, input} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';
@Component({
  selector: 'app-field-errors',
  template: `@if (field()().touched()) { @for (error of field()().errors(); track $index) { <p>{{ error.message }}</p> } }`,
  styles: `:host{display:block;min-height:24px;color:var(--error);font-size:13px}p{margin:5px 0 9px}`,
})
export class FieldErrors { readonly field = input.required<FieldTree<string>>(); }
