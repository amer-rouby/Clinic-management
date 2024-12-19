import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'themeColor',
  standalone: true
})
export class ThemeColorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
