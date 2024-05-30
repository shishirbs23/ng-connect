import { Component, inject, model } from '@angular/core';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { FormService } from '../../../core/services/form.service';

// Enums
import { AuthFormField } from '../../../models/formField.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app-datepicker.component.html',
  styleUrl: './app-datepicker.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class AppDatepickerComponent {
  formService = inject(FormService);
  field = model<AuthFormField>({
    id: 0,
    isRequired: false,
    label: '',
    maxLength: 0,
    minLength: 0,
    name: '',
    type: '',
    value: '',
    values: [],
  });
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
}
