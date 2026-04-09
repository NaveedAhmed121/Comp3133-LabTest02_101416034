import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { SpacexService } from '../../services/spacex.service';
import { Mission } from '../../models/mission.model';
import { MissionfilterComponent } from '../missionfilter/missionfilter.component';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MissionfilterComponent
  ],
  templateUrl: './missionlist.component.html',
  styleUrl: './missionlist.component.scss'
})
export class MissionlistComponent implements OnInit {
  missions: Mission[] = [];
  loading = true;
  error = false;
  selectedYear = '';

  constructor(private spacexService: SpacexService, private router: Router) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.loading = true;
    this.error = false;
    this.spacexService.getAllLaunches().subscribe({
      next: (data) => {
        this.missions = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onYearFilter(year: string): void {
    this.selectedYear = year;
    this.loading = true;
    this.error = false;
    if (!year) {
      this.loadMissions();
      return;
    }
    this.spacexService.getLaunchesByYear(year).subscribe({
      next: (data) => {
        this.missions = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewDetails(flightNumber: number): void {
    this.router.navigate(['/mission', flightNumber]);
  }
}
