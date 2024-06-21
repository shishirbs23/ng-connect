import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Components
import { AppFormComponent } from '../../../../../../core/components/app-form/app-form.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { FormService } from '../../../../../../core/services/form.service';
import { ProfileService } from '../../../../../../services/profile.service';

// Enums
import { FormType } from '../../../../../../utils/enums/form-type.enum';

interface EducationDialogData {
  institutionType: string;
  isAdd: boolean;
  educationDetails?: any;
}

@Component({
  selector: 'profile-add-update-education-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    AppFormComponent,
  ],
  templateUrl: './add-update-education-dialog.component.html',
  styleUrl: './add-update-education-dialog.component.scss',
})
export class AddUpdateEducationDialogComponent {
  headerTitle: string = '';
  institutionType: string = '';
  btnLabel: string = '';

  formTypes = FormType;

  formService = inject(FormService);
  profileService = inject(ProfileService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: EducationDialogData) {}

  ngOnInit() {
    this.prepareUI();
  }

  prepareUI() {
    if (this.data.isAdd) {
      this.headerTitle = 'Add Education Details';
      this.btnLabel = 'Add';
    } else {
      this.headerTitle = 'Edit Education Details';
      this.btnLabel = 'Update';
    }

    this.institutionType = this.data.institutionType;

    this.formService.prepareEducationForm(this.institutionType);

    console.log(this.formService.form);
  }

  onEducationFormSubmit(event: any) {}
}
