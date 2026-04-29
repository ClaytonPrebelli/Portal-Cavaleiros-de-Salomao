import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acredita',
  standalone: true
})
export class AcreditaPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    return value ? 'Sim' : 'Não';
  }

}
