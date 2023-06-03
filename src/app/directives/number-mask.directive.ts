import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberMask]',
})
export class NumberMaskDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let val = input.value.toString();
    if (val.length) {
      val = val.replace(/[\$,]/g, '');
    }
    const regexPattern = /\B(?=(\d{3})+(?!\d))/g;
    const formattedValue = val.replace(regexPattern, ',');
    input.value = `$${formattedValue}`;
  }
}
