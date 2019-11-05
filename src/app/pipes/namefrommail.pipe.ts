import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namefrommail'
})
export class NamefrommailPipe implements PipeTransform {

  transform(value: string): string {
    return value? value.replace(/@.*/, ""): "";
  }

}
