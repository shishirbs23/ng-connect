import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Firebase
import { User, getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';
import { ProfileCompleteDialogComponent } from './profile-complete-dialog/profile-complete-dialog.component';

// Services
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../core/services/ui.service';
import { AppService } from '../../core/services/app.service';

// Enums and Constants
import { Collection } from '../../utils/enums/collection.enum';

// Models
import { User as UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AppHeaderComponent,
    ProfileCompleteDialogComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  auth = getAuth();

  appService = inject(AppService);
  authService = inject(AuthService);
  uiService = inject(UiService);

  currentUser!: UserProfile;
  isUserLoading: boolean = true;
  canCloseDialog: boolean = false;

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.isUserLoading = true;

    // Track Firebase Auth State Change
    this.auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // Get User Profile from Fire Store
        const userRef = doc(
          this.appService._appDB,
          Collection.REGISTERED_USERS,
          user.uid
        );

        const userSnap = await getDoc(userRef);
        const userProfile = userSnap.data() as UserProfile;

        this.isUserLoading = false;
        this.canCloseDialog = !!(userProfile.displayName && userProfile.dob);

        this.currentUser = userProfile;

        console.log(this.currentUser);

        if (
          !userProfile.displayName ||
          !userProfile.dob ||
          !userProfile.dob ||
          !userProfile.photoURL
        ) {
          this.openProfileCompleteDialog(userProfile);
        }
      }
    });
  }

  openProfileCompleteDialog(profile: UserProfile) {
    this.uiService.openDialog(
      ProfileCompleteDialogComponent,
      {
        profile,
      },
      '350px',
      '400px'
    );
  }

  signOutUser() {
    this.authService.signOut();
  }
}
