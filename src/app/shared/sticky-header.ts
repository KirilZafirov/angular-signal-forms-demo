import {Directive, ElementRef, DestroyRef, afterNextRender, inject} from '@angular/core';

// Keep scroll/focus offsets accurate when navigation wraps or the viewport changes.
@Directive({selector: '[appStickyHeader]'})
export class StickyHeader {
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const update = () => document.documentElement.style.setProperty(
        '--demo-header-height', `${this.element.getBoundingClientRect().height}px`,
      );
      update();
      const observer = new ResizeObserver(update);
      observer.observe(this.element);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        document.documentElement.style.removeProperty('--demo-header-height');
      });
    });
  }
}
