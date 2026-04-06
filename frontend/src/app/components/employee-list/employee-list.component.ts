import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, FormsModule, CurrencyPipe, NavbarComponent],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  // Search
  searchType = 'designation';
  searchValue = '';
  isSearching = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employees.';
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchValue.trim()) {
      this.loadEmployees();
      return;
    }

    this.isSearching = true;
    this.loading = true;
    this.errorMessage = '';

    const designation = this.searchType === 'designation' ? this.searchValue.trim() : undefined;
    const department = this.searchType === 'department' ? this.searchValue.trim() : undefined;

    this.employeeService.searchByDesignationOrDepartment(designation, department).subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Search failed.';
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchValue = '';
    this.isSearching = false;
    this.loadEmployees();
  }

  onDelete(eid: string, name: string): void {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    this.employeeService.deleteEmployee(eid).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Employee deleted successfully.';
        this.employees = this.employees.filter((e) => e._id !== eid);
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete employee.';
      },
    });
  }
}
