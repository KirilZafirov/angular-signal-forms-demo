import {Component} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {GeneratedForm} from './generated-form';
import {contactDefinition, contactValues, contactSchema} from './dynamic-example';
@Component({
  selector: 'app-dynamic-page', imports: [GeneratedForm, JsonPipe],
  templateUrl: './dynamic-page.html', styleUrl: './lab.css',
})
export class DynamicPage {
  readonly definition = contactDefinition;
  readonly initialValues = contactValues;
  readonly validationSchema = contactSchema;
  readonly usage = `<app-generated-form
  [definition]="definition"
  [initialValues]="initialValues"
  [validationSchema]="validationSchema"
/>`;
}
