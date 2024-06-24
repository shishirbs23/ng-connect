import { Component, Inject, inject } from '@angular/core';

// RxJS
import { BehaviorSubject, Subscription } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Components
import { AppFormComponent } from '../../../../../../core/components/app-form/app-form.component';

// Forms
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

// Services
import { FormService } from '../../../../../../core/services/form.service';
import { ProfileService } from '../../../../../../services/profile.service';

// Enums
import { FormType } from '../../../../../../utils/enums/form-type.enum';
import { InstitutionType } from '../../../../../../utils/enums/institution-type.enum';
import { Entity } from '../../../../../../utils/enums/entity.enum';
import { EducationDetails } from '../../../../../../models/profile.model';

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
  shouldResetControls: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

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

    this.formService.startDateSub = this.formService.form
      .get(Entity.START_DATE)
      ?.valueChanges.subscribe((startDate) => {
        console.log(startDate);

        if (startDate) {
          const minEndDate = new Date(startDate);
          minEndDate.setDate(minEndDate.getDate() + 1);
          this.formService.form
            .get(Entity.END_DATE)
            ?.setValidators([this.minDateValidator(minEndDate)]);
          console.log(this.formService.form.get(Entity.END_DATE)?.hasValidator);
        } else {
          this.formService.form.get(Entity.END_DATE)?.clearValidators();
        }
        this.formService.form.get(Entity.END_DATE)?.updateValueAndValidity();
      })!;
  }

  minDateValidator(minDate: Date) {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null;
      }
      const controlDate = new Date(control.value);
      return controlDate >= minDate ? null : { minDate: true };
    };
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
  }

  selectType(type: any) {
    this.shouldResetControls.next(true);

    this.selectedTypeId = type.id;

    this.formService.reinitializeForm();

    if (this.selectedTypeId == 1) {
      this.formService.prepareEducationForm(InstitutionType.SCHOOL);
    } else if (this.selectedTypeId == 2) {
      this.formService.prepareEducationForm(InstitutionType.COLLEGE);
    } else if (this.selectedTypeId == 3) {
      this.formService.prepareEducationForm(InstitutionType.UNIVERSITY);
    }
  }

  onEducationFormSubmit(group: FormGroup) {
    const controls = group.controls;

    const educationalDetails: EducationDetails = {
      institutionName: controls['institutionName'].value,
      startDate: controls['startDate'].value,
      endDate: controls['endDate'].value,
      isCurrent: controls['isCurrent'].value,
      description: controls['description'].value,
    };

    if (this.selectedTypeId == 1 || this.selectedTypeId == 2) {
      educationalDetails.classes = controls['classes'].value;
      educationalDetails.group = controls['group'].value;
    } else {
      educationalDetails.fieldOfStudy = controls['fieldOfStudy'].value;
      educationalDetails.degree = controls['degree'].value;
    }

    console.log(educationalDetails);

    this.profileService.saveEducationalDetails(
      educationalDetails,
      this.selectedTypeId
    );
  }
}
