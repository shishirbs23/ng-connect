import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

// Components
import { AppSelectComponent } from '../../../../core/components/app-select/app-select.component';
import { EmoticonDialogComponent } from './emoticon-dialog/emoticon-dialog.component';

// Services
import { ProfileService } from '../../../../services/profile.service';
import { UiService } from '../../../../core/services/ui.service';

// Models
import { ProfileFeed } from '../../../../models/profile-feed.model';

// Pipes
import { PrivacyTypePipe } from '../../../../core/pipes/privacy-type.pipe';

@Component({
  selector: 'profile-feed-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    AppSelectComponent,
    PrivacyTypePipe,
  ],
  templateUrl: './feed-section.component.html',
  styleUrl: './feed-section.component.scss',
})
export class FeedSectionComponent {
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  enteredLocation: string = '';
  isLocationInputOpened: boolean = false;

  feed = model<ProfileFeed>({
    id: '',
    feeling: '',
    photos: [],
    checkIn: '',
    description: '',
    privacyId: this.profileService.profile.privacyId,
    createdAt: '',
    updatedAt: '',
  });

  feelings: string[] = [
    'Happy 😃',
    'Excited 🤩',
    'Joyful 😊',
    'Grateful 🙏',
    'Content 😌',
    'Optimistic 🌞',
    'Proud 🎉',
    'Loved ❤️',
    'Amused 😆',
    'Relieved 😅',
    'Calm 😌',
    'Relaxed 🛋️',
    'Neutral 😐',
    'Curious 🤔',
    'Thoughtful 🤔',
    'Reflective 🧐',
    'Indifferent 😶',
    'Contemplative 🧘',
    'Peaceful ☮️',
    'Satisfied 🙂',
    'Sad 😢',
    'Angry 😠',
    'Frustrated 😤',
    'Anxious 😟',
    'Disappointed 😞',
    'Lonely 😔',
    'Annoyed 😒',
    'Jealous 😒',
    'Hurt 😢',
    'Guilty 😳',
    'Nostalgic 😌',
    'Conflicted 😕',
    'Hopeful 🙏',
    'Overwhelmed 😵',
    'Worried 😟',
    'Awkward 😬',
    'Embarrassed 😳',
    'Empowered 💪',
    'Envious 😒',
    'Shocked 😲',
    'Motivated 💪',
    'Determined 🏋️',
    'Surprised 😮',
    'Inspired 🌟',
    'Bored 😴',
    'Sleepy 😴',
    'Energetic ⚡',
    'Confident 😎',
    'Hungry 🍽️',
    'Stressed 😫',
  ];

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

  removeFeeling() {
    this.feed().feeling = '';
  }

  removeCheckIn() {
    this.feed().checkIn = '';
    this.enteredLocation = '';
  }

  onKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.feed().checkIn = event.target.value;
      this.isLocationInputOpened = false;
    }
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  openEmoticonDialog() {
    this.uiService.openDialog(EmoticonDialogComponent, {}, '785px');

    this.uiService.dialogRef.afterClosed().subscribe((feeling: string) => {
      if (feeling) {
        this.feed().feeling = feeling;
      }
    });
  }

  selectPhotos() {
    (
      document.querySelector('#multiple-file-input') as HTMLInputElement
    )?.click();
  }
}
