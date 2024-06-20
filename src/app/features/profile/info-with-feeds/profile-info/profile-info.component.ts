import { Component } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { BioComponent } from './bio/bio.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { EducationComponent } from './education/education.component';
import { HobbiesComponent } from './hobbies/hobbies.component';
import { ProfessionComponent } from './profession/profession.component';

// Forms
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'profile-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BioComponent,
    BasicInfoComponent,
    EducationComponent,
    HobbiesComponent,
    ProfessionComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  constructor() {}
}
