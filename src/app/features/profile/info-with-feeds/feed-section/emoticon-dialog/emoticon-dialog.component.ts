import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-emoticon-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './emoticon-dialog.component.html',
  styleUrl: './emoticon-dialog.component.scss',
})
export class EmoticonDialogComponent {
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
}