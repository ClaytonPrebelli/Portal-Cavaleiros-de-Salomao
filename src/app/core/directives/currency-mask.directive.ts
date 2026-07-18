import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[currencyMaskBR]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CurrencyMaskDirective),
    multi: true
  }]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  private onChange: (val: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: number): void {
    if (value && value > 0) {
      this.el.nativeElement.value = this.format(value);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (val: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  @HostListener('input', ['$event'])
  onInput(): void {
    const raw = this.el.nativeElement.value.replace(/\D/g, '');
    if (!raw) {
      this.el.nativeElement.value = '';
      this.onChange(0);
      return;
    }

    const cents = parseInt(raw, 10);
    const value = cents / 100;

    this.el.nativeElement.value = this.format(value);
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private format(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
