import { Component, inject } from '@angular/core';

// Components
import { AuthButtonComponent } from './auth-button/auth-button.component';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Services
import { AuthService } from '../../services/auth.service';

// Routing
import { RouteNames } from '../../app.routes';
import { Router } from '@angular/router';

// Enums
import { AuthProviders } from '../../enums/auth-provider.enum';

declare const window: any;

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AuthButtonComponent, MatButtonModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  authProviders = AuthProviders;

  ngOnInit() {
    this.checkUserToken();
  }

  checkUserToken() {
    const token: String = localStorage.getItem('token') ?? '';

    if (token) {
      this.router.navigateByUrl(RouteNames.PROFILE);
    }
  }

  connectWithAuthProvider(authProvider: string) {
    this.authService.signInWithProvider(authProvider);
  }
}
