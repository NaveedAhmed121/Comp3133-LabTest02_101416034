import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../graphql.operations';

export interface User {
  _id: string;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'currentUser';

  constructor(private apollo: Apollo, private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  login(usernameOrEmail: string, password: string): Observable<User> {
    return this.apollo
      .query<{ login: User }>({
        query: LOGIN_QUERY,
        variables: { input: { usernameOrEmail, password } },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => result.data!.login),
        tap((user) => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        })
      );
  }

  signup(username: string, email: string, password: string): Observable<User> {
    return this.apollo
      .mutate<{ signup: User }>({
        mutation: SIGNUP_MUTATION,
        variables: { input: { username, email, password } },
      })
      .pipe(
        map((result) => result.data!.signup),
        tap((user) => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }
}
