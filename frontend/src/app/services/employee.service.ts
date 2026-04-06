import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  GET_ALL_EMPLOYEES,
  SEARCH_EMPLOYEE_BY_EID,
  SEARCH_EMPLOYEES_BY_DESIGNATION_OR_DEPARTMENT,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
} from '../graphql.operations';

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .watchQuery<{ getAllEmployees: Employee[] }>({
        query: GET_ALL_EMPLOYEES,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => (result.data?.getAllEmployees ?? []) as Employee[])
      );
  }

  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo
      .query<{ searchEmployeeByEid: Employee }>({
        query: SEARCH_EMPLOYEE_BY_EID,
        variables: { eid },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((result) => result.data!.searchEmployeeByEid));
  }

  searchByDesignationOrDepartment(
    designation?: string,
    department?: string
  ): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
        query: SEARCH_EMPLOYEES_BY_DESIGNATION_OR_DEPARTMENT,
        variables: { designation: designation ?? null, department: department ?? null },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map(
          (result) =>
            (result.data?.searchEmployeeByDesignationOrDepartment ?? []) as Employee[]
        )
      );
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate<{ addNewEmployee: Employee }>({
        mutation: ADD_EMPLOYEE,
        variables: { input },
      })
      .pipe(map((result) => result.data!.addNewEmployee));
  }

  updateEmployee(eid: string, input: Partial<EmployeeInput>): Observable<Employee> {
    return this.apollo
      .mutate<{ updateEmployeeByEid: Employee }>({
        mutation: UPDATE_EMPLOYEE,
        variables: { eid, input },
      })
      .pipe(map((result) => result.data!.updateEmployeeByEid));
  }

  deleteEmployee(eid: string): Observable<{ message: string }> {
    return this.apollo
      .mutate<{ deleteEmployeeByEid: { message: string } }>({
        mutation: DELETE_EMPLOYEE,
        variables: { eid },
        refetchQueries: [{ query: GET_ALL_EMPLOYEES }],
      })
      .pipe(map((result) => result.data!.deleteEmployeeByEid));
  }
}
