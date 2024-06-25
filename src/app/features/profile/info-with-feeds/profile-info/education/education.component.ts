import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AddUpdateEducationDialogComponent } from './add-update-education-dialog/add-update-education-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../../../../core/components/confirm-delete-dialog/confirm-delete-dialog.component';

// Services
import { ProfileService } from '../../../../../services/profile.service';
import { UiService } from '../../../../../core/services/ui.service';

// Enums
import { InstitutionType } from '../../../../../utils/enums/institution-type.enum';
import { EducationDetails } from '../../../../../models/profile.model';

@Component({
  selector: 'profile-education',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  institutionTypes = InstitutionType;

  openEducationAddUpdateDialog(
    institutionType: string,
    isAdd: boolean,
    educationDetails?: any
  ) {
    this.uiService.openDialog(
      AddUpdateEducationDialogComponent,
      {
        institutionType: institutionType || null,
        isAdd,
        educationDetails,
      },
      '400px'
    );
  }

  editEducationalDetail(
    institutionType: string,
    educationDetails: EducationDetails,
    index: number
  ) {
    this.uiService.openDialog(
      AddUpdateEducationDialogComponent,
      {
        institutionType: institutionType || null,
        isAdd: false,
        educationDetails,
        index
      },
      '400px'
    );
  }

  deleteEducationalDetail(institutionType: string, index: number) {
    let deleteText: string = `this ${institutionType.toLocaleLowerCase()}`;

    this.uiService.openDialog(ConfirmDeleteDialogComponent, {
      deleteText,
    });

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      if (res && this.profileService.profile.educationalHistory) {
        let { schools, colleges, universities } =
          this.profileService.profile.educationalHistory;

        if (institutionType === InstitutionType.SCHOOL) {
          schools.splice(index, 1);
          this.profileService.profile.educationalHistory.schools = schools;
        } else if (institutionType === InstitutionType.COLLEGE) {
          colleges.splice(index, 1);
          this.profileService.profile.educationalHistory.colleges = colleges;
        } else if (institutionType === InstitutionType.UNIVERSITY) {
          universities.splice(index, 1);
          this.profileService.profile.educationalHistory.universities =
            universities;
        }

        this.profileService.deleteEducationalDetails();
      }
    });
  }
}
