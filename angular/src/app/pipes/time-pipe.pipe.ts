import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convert24To12'})
export class Convert24To12Pipe implements PipeTransform {
  transform(date: string): string {
    var hours = ((Number(date.split(':')[0]) + 11) % 12 + 1);
    var res: string = hours + ':' + date.split(':')[1];
    return res + ((Number(date.split(':')[0]) > 11) ? ' PM' : ' AM');
  }
}