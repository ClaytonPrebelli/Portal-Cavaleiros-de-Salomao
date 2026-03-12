import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acredita'
})
export class AcreditaPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
   if(value){
    return "Sim"
   }else{
    return "Não"
   }
  }

}
