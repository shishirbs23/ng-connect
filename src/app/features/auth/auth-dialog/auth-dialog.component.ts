import { Component, Inject, input } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Enums
import { AuthMode } from '../../../enums/auth-mode.enum';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
})
export class AuthDialogComponent {
  authMode = AuthMode;
  headerTitle: string = this.data.mode == this.authMode.SIGNIN ? 'Sign In' : 'Sign Up';

  constructor(@Inject(MAT_DIALOG_DATA) public data: {mode: string}) { }

  /* @Inject(MAT_DIALOG_DATA)
  data!: { mode: string }; */

  ngOnInit() {
    /* this.headerTitle =
      this.data.mode == this.authMode.SIGNIN ? 'Sign In' : 'Sign Up'; */
  }
}
