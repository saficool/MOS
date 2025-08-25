export interface HolidayLayoutItem {
  holidayId: string
  holidayName: string
  holidayType: number

  backgroundColor?: string;
  textColor?: string;

  startDate: Date;
  endDate: Date;
  duration: number;

  x: number;
  y: number;
  w: number;
}
