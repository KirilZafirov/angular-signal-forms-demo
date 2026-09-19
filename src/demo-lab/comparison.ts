import { Component, signal, computed } from '@angular/core';
import { comparisons } from './comparison-data';
@Component({
  selector: 'app-comparison',
  styleUrl: './lab.css',
  templateUrl: './comparison.html',
})
export class Comparison {
  readonly topics = comparisons;
  readonly selected = signal(0);
  readonly current = computed(() => this.topics[this.selected()]);
}
