import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qtdNumeros'
})
export class QtdNumerosPipe implements PipeTransform {

  transform(value: number|null, ...args: unknown[]): string|null {
    if(value){
    var texto = value?.toString()
    var textoCompleto = texto.padStart(6,"0")

    return textoCompleto?textoCompleto:''
    }else{
      return ''
    }
  }

}
