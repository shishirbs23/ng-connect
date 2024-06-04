import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// Firebase
import { User, getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { ImageViewerComponent } from '../../core/components/image-viewer/image-viewer.component';
import { ProfileCompleteDialogComponent } from './profile-complete-dialog/profile-complete-dialog.component';
import { ProfilePictureUploadOptionsComponent } from './profile-picture-upload-options/profile-picture-upload-options.component';

// Services
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../core/services/app.service';
import { ProfileService } from '../../services/profile.service';
import { UiService } from '../../core/services/ui.service';

// Enums and Constants
import { Collection } from '../../utils/enums/collection.enum';

// Models
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    ProfileCompleteDialogComponent,
    ProfilePictureUploadOptionsComponent,
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
      '300px',
      '300px'
    );
  }

  signOutUser() {
    this.authService.signOut();
  }
}
