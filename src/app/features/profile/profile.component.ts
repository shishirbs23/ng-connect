import { Component, inject } from '@angular/core';

// Angular Material
import { MatButton } from '@angular/material/button';

// Firebase
import { User, getAuth } from 'firebase/auth';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// Services
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../core/services/ui.service';
import { ProfileCompleteDialogComponent } from '../../profile-complete-dialog/profile-complete-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AppHeaderComponent, MatButton],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  auth = getAuth();

  authService = inject(AuthService);
  uiService = inject(UiService);

  currentUser!: User | null;

  ngOnInit() {
    this.openProfileCompleteDialog();
    this.getCurrentUser();
  }

  openProfileCompleteDialog() {
    this.uiService.openDialog(ProfileCompleteDialogComponent, {}, '90vw');
  }

  getCurrentUser() {
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
      }
    });
  }

  signOutUser() {
    this.authService.signOut();
  }
}
