import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Components
import { AppInputComponent } from '../../../core/components/app-input/app-input.component';
import { AppSelectComponent } from '../../../core/components/app-select/app-select.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

// Enums & Constants
import { AuthMode } from '../../../utils/enums/auth-mode.enum';

// Services
import { AppService } from '../../../core/services/app.service';
import { FormService } from '../../../core/services/form.service';

// Models
import { FieldType } from '../../../utils/enums/field-type.enum';

// Pipes
import { InputTypePipe } from '../../../core/pipes/input-type.pipe';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    InputTypePipe,
    AppInputComponent,
    AppSelectComponent,
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

  onAuthFormSubmit() {}

  ngOnDestroy() {
    this.formService.finishWatching();
  }
}
