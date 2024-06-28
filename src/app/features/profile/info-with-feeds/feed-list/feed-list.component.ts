import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Service
import { ProfileService } from '../../../../services/profile.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'profile-feed-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './feed-list.component.html',
  styleUrl: './feed-list.component.scss',
})
export class FeedListComponent {
  profileService = inject(ProfileService);
}
