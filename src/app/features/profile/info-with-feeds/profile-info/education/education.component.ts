import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services
import { ProfileService } from '../../../../../services/profile.service';
import { UiService } from '../../../../../core/services/ui.service';
import { AddUpdateEducationDialogComponent } from './add-update-education-dialog/add-update-education-dialog.component';

@Component({
  selector: 'profile-education',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
  service = inject(ProfileService);
  uiService = inject(UiService);

  openEducationAddUpdateDialog() {
    this.uiService.openDialog(AddUpdateEducationDialogComponent);
  }
}
