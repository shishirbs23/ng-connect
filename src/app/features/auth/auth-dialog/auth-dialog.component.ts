import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppFormComponent } from '../../../core/components/app-form/app-form.component';

// Forms
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Enums & Constants
import { AuthMode } from '../../../utils/enums/auth-mode.enum';

// Services
import { AppService } from '../../../core/services/app.service';
import { FormService } from '../../../core/services/form.service';

// Models
import { FieldType } from '../../../utils/enums/field-type.enum';

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
    AppFormComponent,
  ],
})
export class AuthDialogComponent {
  authMode = AuthMode;
  headerTitle: string =
    this.data.mode == this.authMode.SIGNIN ? 'Sign In' : 'Sign Up';

  fieldTypes = FieldType;

  appService = inject(AppService);
  formService = inject(FormService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mode: string }) {}

  ngOnInit() {
    this.formService.getAuthFormFields(this.data);
    this.formService.watchFormEvents();
  }

  onAuthFormSubmit(event: FormGroup<any>) {
    console.log(event);
  }

  ngOnDestroy() {
    this.formService.finishWatching();
  }
}
