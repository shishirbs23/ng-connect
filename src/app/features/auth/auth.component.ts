import { Component, inject } from '@angular/core';

// Components
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

// Angular Material
import { MatDialog } from '@angular/material/dialog';

// Services
import { AuthService } from '../../services/auth.service';

// Routing
import { RouteNames } from '../../app.routes';
import { Router } from '@angular/router';

// Enums
import { AuthProvider } from '../../utils/enums/auth-provider.enum';
import { AuthMode } from '../../utils/enums/auth-mode.enum';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [AuthButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  authProviders = AuthProvider;
  authMode = AuthMode;

  openAuthDialog(mode: string) {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '400px',
      data: {
        mode,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  connectWithAuthProvider(authProvider: string) {
    this.authService.signInWithProvider(authProvider);
  }
}
