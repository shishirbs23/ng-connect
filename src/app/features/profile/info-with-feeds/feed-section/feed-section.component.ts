import { Component } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'profile-feed-section',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './feed-section.component.html',
  styleUrl: './feed-section.component.scss'
})
export class FeedSectionComponent {

}
