import { Component, inject, model } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Models
import { FormField } from '../../../models/formField.model';

// Services
import { FormService } from '../../services/form.service';

// Pipes
import { InputTypePipe } from '../../pipes/input-type.pipe';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './app-input.component.html',
  styleUrl: './app-input.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InputTypePipe,
  ],
})
export class AppInputComponent {
  field = model<FormField>({
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

  formService = inject(FormService);
}
