import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize', standalone: true })
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.split(' ').map(word =>
      word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1).toLocaleLowerCase('pt-BR')
    ).join(' ');
  }
}
