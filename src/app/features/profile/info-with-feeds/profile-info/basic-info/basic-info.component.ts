import { Component, inject } from '@angular/core';

// Forms
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services
import { ProfileService } from '../../../../../services/profile.service';

// Pipes
import { AddressFormatterPipe } from '../../../../../core/pipes/address-formatter.pipe';

@Component({
  selector: 'profile-basic-info',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AddressFormatterPipe,
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent {
  service = inject(ProfileService);
  profileInfoForm!: FormGroup;
  isLongAddress: boolean = false;

  constructor() {
    this.prepareForm();
  }

  prepareForm() {
    this.profileInfoForm = new FormGroup({
      longDescription: new FormControl(
        this.service.profile?.address?.longDescription
      ),
      country: new FormControl(this.service.profile.address?.country),
      state: new FormControl(this.service.profile.address?.state),
      division: new FormControl(this.service.profile.address?.division),
      city: new FormControl(this.service.profile.address?.city),
    });
  }

  toggleAddressEditor() {
    this.service.isEditable.address = !this.service.isEditable.address;
  }

  async saveAddress() {
    this.profileInfoForm.disable();

    const { longDescription, country, state, division, city } =
      this.profileInfoForm.value;

    this.service.profile = {
      ...this.service.profile,
      address: {
        longDescription,
        country,
        state,
        division,
        city,
      },
    };

    await this.service.setProfile(
      this.service.profile,
      false,
      'Address Updated'
    );

    this.profileInfoForm.enable();

    this.service.isEditable.address = false;
  }
}
