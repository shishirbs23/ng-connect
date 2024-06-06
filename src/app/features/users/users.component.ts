import { Component } from '@angular/core';

// components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// enums
import { PageType } from '../../utils/enums/page-type.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AppHeaderComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  pageTypes = PageType;
}
