import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { SpacexService } from '../../services/spacex.service';
import { Mission } from '../../models/mission.model';

@Component({
  selector: 'app-missiondetails',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: './missiondetails.component.html',
  styleUrl: './missiondetails.component.scss'
})
export class MissiondetailsComponent implements OnInit {
  mission: Mission | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spacexService: SpacexService
  ) {}

  ngOnInit(): void {
    const flightNumber = Number(this.route.snapshot.paramMap.get('id'));
    if (flightNumber) {
      this.spacexService.getLaunchByFlightNumber(flightNumber).subscribe({
        next: (data) => {
          this.mission = data;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
