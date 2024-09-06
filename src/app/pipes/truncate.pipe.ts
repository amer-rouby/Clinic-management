import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 100, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';

    if (value.length <= limit) return value;

    let truncatedText = value.substr(0, limit);

    if (completeWords) {
      truncatedText = truncatedText.substr(0, truncatedText.lastIndexOf(' '));
    }

    return truncatedText + ellipsis;
  }

}
