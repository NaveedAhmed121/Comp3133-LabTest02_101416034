import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-list/employee-list.component').then(
        (m) => m.EmployeeListComponent
      ),
  },
  {
    path: 'employees/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-add/employee-add.component').then(
        (m) => m.EmployeeAddComponent
      ),
  },
  {
    path: 'employees/view/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-view/employee-view.component').then(
        (m) => m.EmployeeViewComponent
      ),
  },
  {
    path: 'employees/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-edit/employee-edit.component').then(
        (m) => m.EmployeeEditComponent
      ),
  },
  { path: '**', redirectTo: '/login' },
];
