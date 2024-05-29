import { Component, inject, output } from '@angular/core';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
    AppInputComponent,
    AppSelectComponent,
    AppDatepickerComponent,
  ],
  templateUrl: './app-form.component.html',
  styleUrl: './app-form.component.scss',
})
export class AppFormComponent {
  formService = inject(FormService);
  submitForm = output<FormGroup>();
  fieldTypes = FieldType;
}
