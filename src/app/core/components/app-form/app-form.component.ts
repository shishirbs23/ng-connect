import { Component, inject, input, output } from '@angular/core';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppInputComponent } from '../app-input/app-input.component';
import { AppDatepickerComponent } from '../app-datepicker/app-datepicker.component';
import { AppSelectComponent } from '../app-select/app-select.component';

// Services
import { FormService } from '../../services/form.service';

// Forms
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Enums
import { FieldType } from '../../../utils/enums/field-type.enum';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AppInputComponent,
    AppSelectComponent,
    AppDatepickerComponent,
  ],
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.scss',
})
export class AppFormComponent {
  headerTitle = input<string>();
  isLoading = input<boolean>();
  formService = inject(FormService);
  
  submitForm = output<FormGroup>();
  fieldTypes = FieldType;

  onSignUp() {
    this.formService.form.disable();
    this.submitForm.emit(this.formService.form);
  }
}
