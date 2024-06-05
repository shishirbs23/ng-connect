import { Component, inject, input } from '@angular/core';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { WebcamDialogComponent } from '../webcam-dialog/webcam-dialog.component';

// Services
import { ProfileService } from '../../../services/profile.service';
import { UiService } from '../../../core/services/ui.service';

// Models
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-profile-picture-upload-options',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './profile-picture-upload-options.component.html',
  styleUrl: './profile-picture-upload-options.component.scss',
})
export class ProfilePictureUploadOptionsComponent {
  profile = input.required<Profile>();

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  openWebcamDialog() {
    this.uiService.openDialog(WebcamDialogComponent, {
      profile: this.profile(),
    });
  }
}
