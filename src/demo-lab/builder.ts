import { Component, signal, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { GeneratedForm } from './generated-form';
import {BuilderActions} from './builder-actions';
@Component({
  selector: 'app-builder',
  imports: [GeneratedForm, JsonPipe],
  providers: [BuilderActions],
  styleUrl: './lab.css',
  templateUrl: './builder.html',
})
export class Builder {
  readonly description = signal(
    'Create a workshop signup with name, email, optional company, and optional notes.',
  );
  readonly actions = inject(BuilderActions);
}
