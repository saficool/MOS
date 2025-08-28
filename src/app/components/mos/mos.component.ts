import { Component } from '@angular/core';
import { MosContainerComponent } from '../../widgets/mos-container/mos-container.component';
import { MosService } from '../../services/mos.service';
import { ResourceDto } from '../../Dtos/Resource.dto';
import { BatchDto } from '../../Dtos/Batch.dto';
import { HolidayTypeDto } from '../../Dtos/HolidayType.dto';
import { HolidayDto } from '../../Dtos/Holiday.dto';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-mos',
  imports: [MosContainerComponent],
  templateUrl: './mos.component.html',
  styleUrl: './mos.component.scss'
})
export class MosComponent {

  rawBatches: BatchDto[] = [];
  rawResources: ResourceDto[] = [];

  constructor(
    private readonly mosService: MosService,
    private readonly utilityService: UtilityService
  ) {
  }

  ngOnInit() {
    this.getBatches();
    this.getResources();
    this.getHolidayTypes()
    this.getHolidays()
  }

  getBatches() {
    this.mosService.getBatches().subscribe({
      next: (data: BatchDto[]) => {
        this.mosService.batches.set([...data]);
      },
      error: (error) => {
        console.error('Error fetching batches:', error);
      }
    });
  }

  getResources() {
    this.mosService.getresources().subscribe({
      next: (data: ResourceDto[]) => {
        this.mosService.resources.set([...data]);
        this.getStartEndDates(data);
      },
      error: (error) => {
        console.error('Error fetching resources:', error);
      }
    });
  }

  getHolidays() {
    this.mosService.getHolidays().subscribe({
      next: (data: HolidayDto[]) => {
        this.mosService.holidays.set([...data])
      },
      error: (error) => {
        console.error('Error fetching holidays:', error);
      }
    }
    )
  }

  getHolidayTypes() {
    this.mosService.getHolidayTypes().subscribe({
      next: (data: HolidayTypeDto[]) => {
        this.mosService.holidayTypes.set([...data])
      },
      error: (error) => {
        console.error('Error fetching holiday types:', error);
      }
    }
    )
  }

  getStartEndDates(resources: ResourceDto[]) {
    // Calculate the minimum and maximum dates from the resources
    const { minDate, maxDate } = this.utilityService.getMinMaxDates(resources);
    this.mosService.startDate.set(minDate)
    this.mosService.endDate.set(maxDate)
  }



}
