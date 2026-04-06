import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-add',
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent {
  employeeForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
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

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.employeeForm.value;
    const input = {
      ...formValue,
      salary: Number(formValue.salary),
      employee_photo: formValue.employee_photo || undefined,
    };

    this.employeeService.addEmployee(input).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Failed to add employee.';
      },
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.employeeForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
