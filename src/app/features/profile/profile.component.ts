import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// Firebase
import { getAuth } from 'firebase/auth';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { AppDatepickerComponent } from '../../core/components/app-datepicker/app-datepicker.component';
import { ConfirmDeleteDialogComponent } from '../../core/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ImageViewerComponent } from '../../core/components/image-viewer/image-viewer.component';
import { ProfileCompleteDialogComponent } from './profile-complete-dialog/profile-complete-dialog.component';
import { ProfilePictureUploadOptionsComponent } from './profile-picture-upload-options/profile-picture-upload-options.component';
import { WebcamDialogComponent } from './webcam-dialog/webcam-dialog.component';

// Services
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../core/services/app.service';
import { FormService } from '../../core/services/form.service';
import { ProfileService } from '../../services/profile.service';
import { UiService } from '../../core/services/ui.service';

// Models
import { AuthFormField } from '../../models/formField.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    ProfileCompleteDialogComponent,
    ProfilePictureUploadOptionsComponent,
    AppDatepickerComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    DatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  auth = getAuth();

  appService = inject(AppService);
  authService = inject(AuthService);
  formService = inject(FormService);
  uiService = inject(UiService);
  profileService = inject(ProfileService);

  ngOnInit() {
    this.profileService.getCurrentProfile();
  }

  viewProfilePhoto() {
    this.uiService.openDialog(
      ImageViewerComponent,
      {
        url: this.profileService.profile.photoURL,
      },
      '600px',
      '500px'
    );
  }

  openConfirmDeletionDialog() {
    this.uiService.openDialog(ConfirmDeleteDialogComponent);

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.profileService.deleteProfileImage(
          this.profileService.profile.uid,
          this.profileService.profile.photoName!
        );
      }
    });
  }

  openWebcamDialog() {
    this.uiService.openDialog(WebcamDialogComponent, {
      profile: this.profileService.profile,
    });
  }

  async saveProfile() {
    const updatedProfile = { ...this.profileService.profile };

    if (this.profileService.isEditable.address) {
    }

    if (this.profileService.isEditable.birthday) {
      const dob = this.appService.formatMomentDate(
        this.formService.form.value.dob
      );
      updatedProfile.dob = dob;
    }

    if (this.profileService.isEditable.phoneNumber) {
    }

    await this.profileService.setProfile(updatedProfile);

    this.profileService.isEditable = {
      address: false,
      birthday: false,
      phoneNumber: false,
    };
  }

  signOutUser() {
    this.authService.signOut();
  }
}
