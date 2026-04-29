import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qtdNumeros',
  standalone: true
})
export class QtdNumerosPipe implements PipeTransform {

  transform(value: number | null, ...args: unknown[]): string | null {
    if (value) {
      const texto = value.toString();
      const textoCompleto = texto.padStart(6, '0');
      return textoCompleto ? textoCompleto : '';
    } else {
      return '';
    }
  }

}
