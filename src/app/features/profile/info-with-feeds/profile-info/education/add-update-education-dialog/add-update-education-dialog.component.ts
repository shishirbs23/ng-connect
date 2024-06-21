import { Component, Inject, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
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
import { InstitutionType } from '../../../../../../utils/enums/institution-type.enum';

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
    MatChipsModule,
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
  selectedTypeId: number = 1;

  formTypes = FormType;

  formService = inject(FormService);
  profileService = inject(ProfileService);

  types = [
    {
      id: 1,
      name: 'School',
    },
    {
      id: 2,
      name: 'College',
    },
    {
      id: 3,
      name: 'University',
    },
  ];

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

  selectType(type: any) {
    this.formService.reinitializeForm();

    this.selectedTypeId = type.id;

    if (this.selectedTypeId == 1) {
      this.formService.prepareEducationForm(InstitutionType.SCHOOL);
    } else if (this.selectedTypeId == 2) {
      this.formService.prepareEducationForm(InstitutionType.COLLEGE);
    } else if (this.selectedTypeId == 3) {
      this.formService.prepareEducationForm(InstitutionType.UNIVERSITY);
    }
  }

  onEducationFormSubmit(event: any) {
    console.log(event);
  }
}
