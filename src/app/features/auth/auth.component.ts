import { Component, inject } from '@angular/core';

// Components
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

// Services
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../core/services/ui.service';

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
  private uiService = inject(UiService);

  authProviders = AuthProvider;
  authMode = AuthMode;

  openAuthDialog(mode: string) {
    this.uiService.openDialog(AuthDialogComponent, { mode }, '400px');
  }

  connectWithAuthProvider(authProvider: string) {
    this.authService.signInWithProvider(authProvider);
  }
}
