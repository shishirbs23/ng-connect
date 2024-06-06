import { Component } from '@angular/core';

// components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// enums
import { PageType } from '../../utils/enums/page-type.enum';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    AppHeaderComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {
  pageTypes = PageType;
}
