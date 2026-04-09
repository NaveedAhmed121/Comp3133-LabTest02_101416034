import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mission } from '../models/mission.model';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private readonly baseUrl = 'https://api.spacexdata.com/v3/launches';
  private cachedMissions: Mission[] = [];

  constructor(private http: HttpClient) {}

  getAllLaunches(): Observable<Mission[]> {
    if (this.cachedMissions.length) {
      return of(this.cachedMissions);
    }
    return this.http.get<Mission[]>(this.baseUrl).pipe(
      tap(missions => this.cachedMissions = missions)
    );
  }

  getLaunchesByYear(year: string): Observable<Mission[]> {
    if (this.cachedMissions.length) {
      return of(this.cachedMissions.filter(m => m.launch_year === year));
    }
    return this.http.get<Mission[]>(`${this.baseUrl}?launch_year=${year}`);
  }

  getLaunchByFlightNumber(flightNumber: number): Observable<Mission> {
    const cached = this.cachedMissions.find(m => m.flight_number === flightNumber);
    if (cached) {
      return of(cached);
    }
    return this.http.get<Mission[]>(this.baseUrl).pipe(
      tap(missions => this.cachedMissions = missions),
      map(missions => {
        const found = missions.find(m => m.flight_number === flightNumber);
        if (!found) throw new Error('Mission not found');
        return found;
      })
    );
  }
}
