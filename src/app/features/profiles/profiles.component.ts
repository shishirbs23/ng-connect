import { Component, inject } from '@angular/core';

// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// Services
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

// Enums
import { PageType } from '../../utils/enums/page-type.enum';

// Pipes
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss',
})
export class ProfilesComponent {
  pageTypes = PageType;

  authService = inject(AuthService);
  profileService = inject(ProfileService);

  ngOnInit() {
    this.profileService.getProfiles();
  }
}
