import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Components
import { ImageViewerComponent } from '../../../../core/components/image-viewer/image-viewer.component';

// Service
import { ProfileService } from '../../../../services/profile.service';
import { UiService } from '../../../../core/services/ui.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Pipes
import { TimeDifferenceTextPipe } from '../../../../core/pipes/time-difference-text.pipe';
import { PrivacyIconPipe } from '../../../../core/pipes/privacy-icon.pipe';
import { PrivacyTypePipe } from '../../../../core/pipes/privacy-type.pipe';

@Component({
  selector: 'profile-feed-list',
  standalone: true,
  templateUrl: './feed-list.component.html',
  styleUrl: './feed-list.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe,
    TimeDifferenceTextPipe,
    PrivacyIconPipe,
    PrivacyTypePipe,
  ],
})
export class FeedListComponent {
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  privacyOptions = [
    {
      id: 1,
      label: 'Public',
      icon: 'public',
    },
    {
      id: 2,
      label: 'Friends',
      icon: 'group',
    },
    {
      id: 3,
      label: 'Only Me',
      icon: 'lock',
    },
  ];

  constructor() {
    let { feeds } = this.profileService.profile;

    feeds.forEach((feed) => {
      feed.isExpanded = false;
    });
  }

  viewFeedImage(url: string) {
    this.uiService.openDialog(ImageViewerComponent, {
      url,
    });
  }
}
