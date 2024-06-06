import { Component, input } from '@angular/core';

// Angular Material
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

// Router
import { RouterLink } from '@angular/router';

// Enums
import { PageType } from '../../../utils/enums/page-type.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  headerText = input.required<string>();
  centreTitle = input<boolean>(false);
  pageType = input<string>();
  pageTypes = PageType;
}
