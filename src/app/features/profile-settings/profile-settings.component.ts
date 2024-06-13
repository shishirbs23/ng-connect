import { Component } from '@angular/core';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// Enums
import { PageType } from '../../utils/enums/page-type.enum';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    AppHeaderComponent
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {
  pageTypes = PageType;
}
