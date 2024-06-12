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

// Enums
import { PictureOption } from '../../../utils/enums/picture-option.enum';

@Component({
  selector: 'app-cover-photo-upload-options',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './cover-photo-upload-options.component.html',
  styleUrl: './cover-photo-upload-options.component.scss',
})
export class CoverPhotoUploadOptionsComponent {
  profile = input.required<Profile>();
  option = input.required<PictureOption>();

  pictureOptions = PictureOption;

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  openWebcamDialog() {
    this.uiService.openDialog(WebcamDialogComponent, {
      profile: this.profile(),
    });
  }
}
