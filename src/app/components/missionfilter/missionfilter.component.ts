import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './missionfilter.component.html',
  styleUrl: './missionfilter.component.scss'
})
export class MissionfilterComponent {
  @Input() selectedYear = '';
  @Output() yearSelected = new EventEmitter<string>();

  years: string[] = [];

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let y = 2006; y <= currentYear; y++) {
      this.years.push(y.toString());
    }
  }

  onYearChange(year: string): void {
    this.yearSelected.emit(year);
  }

  clearFilter(): void {
    this.selectedYear = '';
    this.yearSelected.emit('');
  }
}
