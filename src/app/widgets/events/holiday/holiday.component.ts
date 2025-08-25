import { Component, Input } from '@angular/core';
import { HolidayLayoutItem } from '../../../interfaces/holiday-layout-item.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'g[app-holiday]',
  imports: [DatePipe],
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss'
})
export class HolidayComponent {

  @Input({ required: true }) holiday!: HolidayLayoutItem;
  @Input({ required: true }) rowHeight!: number;

}
