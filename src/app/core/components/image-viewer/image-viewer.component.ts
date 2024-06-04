import { NgOptimizedImage } from '@angular/common';
import { Component, Inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, NgOptimizedImage],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}
}
