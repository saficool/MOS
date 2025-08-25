import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { BatchDto } from '../Dtos/Batch.dto';
import { ResourceDto } from '../Dtos/Resource.dto';
import { HolidayTypeDto } from '../Dtos/HolidayType.dto';
import { HolidayDto } from '../Dtos/Holiday.dto';

@Injectable({
  providedIn: 'root'
})
export class MosService {

  batches = signal<BatchDto[]>([]);
  resources = signal<ResourceDto[]>([]);
  holidays = signal<HolidayDto[]>([]);
  holidayTypes = signal<HolidayTypeDto[]>([]);

  constructor(private readonly http: HttpClient) { }

  getBatches(): Observable<BatchDto[]> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      params: new HttpParams()
    }
    return this.http.get<BatchDto[]>(`${environment.apiUrl}/api/mos/GetBatches`, options);
  }

  getresources(): Observable<ResourceDto[]> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      params: new HttpParams()
    }
    return this.http.get<ResourceDto[]>(`${environment.apiUrl}/api/mos/GetResources`, options);
  }

  getHolidayTypes(): Observable<HolidayTypeDto[]> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      params: new HttpParams()
    }
    return this.http.get<HolidayTypeDto[]>(`${environment.apiUrl}/api/mos/GetHolidayTypes`, options);
  }

  getHolidays(): Observable<HolidayDto[]> {
    const options = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      params: new HttpParams()
    }
    return this.http.get<HolidayDto[]>(`${environment.apiUrl}/api/mos/GetHolidays`, options);
  }

}
