import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// Forms
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Services
import { ProfileService } from '../../../../services/profile.service';

@Component({
  selector: 'profile-info',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  service = inject(ProfileService);

  profileInfoForm!: FormGroup;

  constructor() {
    this.prepareForm();
  }

  prepareForm() {
    this.profileInfoForm = new FormGroup({
      bio: new FormControl(this.service.profileInfo.bio, [
        Validators.maxLength(200),
      ]),
    });
  }

  toggleBioEditor() {
    this.service.isEditable.bio = !this.service.isEditable.bio;
  }
}
