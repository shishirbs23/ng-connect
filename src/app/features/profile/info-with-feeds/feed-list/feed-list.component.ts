import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Service
import { ProfileService } from '../../../../services/profile.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Pipes
import { TimeDifferenceTextPipe } from '../../../../core/pipes/time-difference-text.pipe';

@Component({
  selector: 'profile-feed-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    TimeDifferenceTextPipe,
  ],
  templateUrl: './feed-list.component.html',
  styleUrl: './feed-list.component.scss',
})
export class FeedListComponent {
  profileService = inject(ProfileService);
}
