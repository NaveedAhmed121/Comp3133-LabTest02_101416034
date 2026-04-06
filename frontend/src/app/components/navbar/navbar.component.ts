import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  currentUser = inject(AuthService).getUser();

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
