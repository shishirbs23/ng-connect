import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Webcam
import { WebcamModule } from 'ngx-webcam';

@Component({
  selector: 'app-webcam-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, WebcamModule],
  templateUrl: './webcam-dialog.component.html',
  styleUrl: './webcam-dialog.component.scss',
})
export class WebcamDialogComponent {}
