import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Components
import { AppFormComponent } from '../../../core/components/app-form/app-form.component';

// Forms
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Router
import { Router } from '@angular/router';

// Enums & Constants
import { AuthMode } from '../../../utils/enums/auth-mode.enum';
import { DialogMode } from '../../../utils/enums/dialog-mode.enum';
import { FieldType } from '../../../utils/enums/field-type.enum';

// Services
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../core/services/app.service';
import { FormService } from '../../../core/services/form.service';

// Models
import { AuthUser } from '../../../models/auth-user.model';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AppFormComponent,
  ],
})
export class AuthDialogComponent {
  authModes = AuthMode;
  fieldTypes = FieldType;
  dialogModes = DialogMode;

  headerTitle: string =
    this.data.mode == this.authModes.SIGNIN ? 'Sign In' : 'Sign Up';

  authService = inject(AuthService);
  appService = inject(AppService);
  formService = inject(FormService);
  router = inject(Router);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mode: string }) {}

  ngOnInit() {
    this.formService.getAuthFormFields(this.data);
    this.formService.watchFormEvents();
  }

  onAuthFormSubmit(event: FormGroup<any>) {
    const authFormValue: AuthUser = event.value;

    this.data.mode == this.authModes.SIGNIN
      ? this.onSignIn(authFormValue)
      : this.onSignUp(authFormValue);
  }

  onSignIn(signInFormValue: Partial<AuthUser>) {
    this.authService.signIn(signInFormValue);
  }

  onSignUp(signUpFormValue: AuthUser) {
    this.authService.signUp(signUpFormValue);
  }

  ngOnDestroy() {
    this.formService.finishWatching();
  }
}
