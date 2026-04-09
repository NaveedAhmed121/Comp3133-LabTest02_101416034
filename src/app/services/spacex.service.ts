import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mission } from '../models/mission.model';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private readonly baseUrl = 'https://api.spacexdata.com/v3/launches';

  constructor(private http: HttpClient) {}

  getAllLaunches(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.baseUrl);
  }

  getLaunchesByYear(year: string): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.baseUrl}?launch_year=${year}`);
  }

  getLaunchByFlightNumber(flightNumber: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.baseUrl}/${flightNumber}`);
  }
}
