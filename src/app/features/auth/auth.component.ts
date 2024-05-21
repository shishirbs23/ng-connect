import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Services
import { AuthService } from '../../services/auth.service';

// Routing
import { RouteNames } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.checkUserToken();
  }

  checkUserToken() {
    const token: String = localStorage.getItem('token') ?? '';

    if (token) {
      this.router.navigateByUrl(RouteNames.PROFILE);
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }
}
