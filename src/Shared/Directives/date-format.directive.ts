import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective implements OnInit {
  @Input('appDateFormat') formatPattern!: string;
  @Input() dateValue!: string | Date;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.formatDate();
  }

  private formatDate() {
    let value: string = this.dateValue ? this.dateValue.toString() : this.el.nativeElement.innerText;
    if (value) {
      try {
        let date = new Date(value);
        let formattedDate = format(date, this.formatPattern || 'dd/MM/yyyy');
        this.el.nativeElement.innerText = formattedDate;
      } catch (error) {
        console.error('Invalid date format');
      }
    }
  }
}
