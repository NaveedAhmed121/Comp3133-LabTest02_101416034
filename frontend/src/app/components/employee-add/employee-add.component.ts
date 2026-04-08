import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { UploadService } from '../../services/upload.service';
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
  uploading = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private uploadService: UploadService,
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

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file (JPEG, PNG, etc.).';
      return;
    }

    this.selectedFile = file;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.photoPreview = null;
    this.selectedFile = null;
    this.employeeForm.patchValue({ employee_photo: '' });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    if (this.selectedFile) {
      // Upload photo via HttpClient first, then save employee
      this.uploading = true;
      this.uploadService.uploadPhoto(this.selectedFile).subscribe({
        next: (url) => {
          this.uploading = false;
          this.employeeForm.patchValue({ employee_photo: url });
          this.saveEmployee();
        },
        error: (err) => {
          this.uploading = false;
          this.errorMessage = err.error?.error || 'Photo upload failed.';
        },
      });
    } else {
      this.saveEmployee();
    }
  }

  private saveEmployee(): void {
    this.loading = true;
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
