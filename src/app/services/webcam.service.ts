import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Services
import { ProfileService } from './profile.service';
import { UiService } from '../core/services/ui.service';

// Models
import { Profile } from '../models/profile.model';

// Webcam
import { WebcamImage } from 'ngx-webcam';

@Injectable({
  providedIn: 'root',
})
export class WebcamService {
  imageDataUrl!: string;
  imageFile!: File;

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  showWebCam: boolean = true;
  showWebCamOptions: boolean = false;

  constructor() {}

  triggerSnapshot(): void {
    this.trigger.next();
  }

  async handleImage(webcamImage: WebcamImage, userId: string): Promise<void> {
    this.imageDataUrl = webcamImage.imageAsDataUrl;
    this.showWebCam = false;

    const response = await fetch(this.imageDataUrl);
    const blob = await response.blob();
    const dateNow = Date.now();

    this.imageFile = new File([blob], `${userId}_captured_image_${dateNow}`, {
      type: blob.type,
      lastModified: dateNow,
    });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  cropImage() {}

  switchCamera() {
    this.showWebCam = true;
    this.imageDataUrl = '';
  }

  async saveAsProfilePhoto(profile: Profile) {
    await this.profileService.uploadFile(
      this.imageFile,
      profile,
      !!profile.photoURL
    );
    this.uiService.closeDialog(null);
  }
}
