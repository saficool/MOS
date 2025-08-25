import { HolidayTypeDto } from "./HolidayType.dto";

export interface HolidayDto {
  holidayId: string;
  holidayName: string;
  holidayType: number;
  startDate: Date;
  endDate: Date;
  duration: number;
  backgroundColor?: string;
  textColor?: string;
}
