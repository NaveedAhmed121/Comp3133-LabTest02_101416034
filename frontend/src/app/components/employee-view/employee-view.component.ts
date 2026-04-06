import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { EmployeeService, Employee } from '../../services/employee.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-view',
  imports: [RouterLink, DatePipe, CurrencyPipe, NavbarComponent],
  templateUrl: './employee-view.component.html',
})
export class EmployeeViewComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'No employee ID provided.';
      this.loading = false;
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employee.';
        this.loading = false;
      },
    });
  }
}
