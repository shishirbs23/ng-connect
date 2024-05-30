import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { User, getAuth } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButton],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  auth = getAuth();
  authService = inject(AuthService);
  currentUser!: User | null;

  ngOnInit() {
    this.getCurrentUser();
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
