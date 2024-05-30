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
import { FieldType } from '../../../utils/enums/field-type.enum';

// Services
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../core/services/app.service';
import { FormService } from '../../../core/services/form.service';

// Models
import { SignUp } from '../../../models/sign-up.model';

// Moment
import moment from 'moment';

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
  authMode = AuthMode;
  headerTitle: string =
    this.data.mode == this.authMode.SIGNIN ? 'Sign In' : 'Sign Up';

  fieldTypes = FieldType;

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
    const signUpFormValue: SignUp = event.value;

    console.log(signUpFormValue);

    signUpFormValue.dob = moment().toISOString();
   
    this.authService.signUp(signUpFormValue);
  }

  ngOnDestroy() {
    this.formService.finishWatching();
  }
}
