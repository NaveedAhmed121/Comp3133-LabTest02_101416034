import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-edit',
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  employee: Employee | null = null;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  employeeId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      salary: [null, [Validators.required, Validators.min(0)]],
      date_of_joining: ['', [Validators.required]],
      department: ['', [Validators.required]],
      employee_photo: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'No employee ID provided.';
      this.loading = false;
      return;
    }

    this.employeeId = id;

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        // Format date as YYYY-MM-DD for the date input
        const rawDate = data.date_of_joining;
        let formattedDate = '';
        if (rawDate) {
          // Handle ISO timestamps or plain date strings
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().split('T')[0];
          } else {
            formattedDate = rawDate;
          }
        }

        this.employeeForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          gender: data.gender,
          designation: data.designation,
          salary: data.salary,
          date_of_joining: formattedDate,
          department: data.department,
          employee_photo: data.employee_photo || '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load employee.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const formValue = this.employeeForm.value;
    const input = {
      ...formValue,
      salary: Number(formValue.salary),
      employee_photo: formValue.employee_photo || undefined,
    };

    this.employeeService.updateEmployee(this.employeeId, input).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Employee updated successfully!';
        setTimeout(() => this.router.navigate(['/employees']), 1500);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.message || 'Failed to update employee.';
      },
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.employeeForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
