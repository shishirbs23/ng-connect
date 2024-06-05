import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Services
import { ProfileService } from './profile.service';
import { UiService } from '../core/services/ui.service';

// Models
import { Profile } from '../models/profile.model';

// Webcam
import { WebcamImage } from 'ngx-webcam';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Injectable({
  providedIn: 'root',
})
export class WebcamService {
  imageDataUrl!: string;
  imageFile!: File;
  croppedImageBlob!: Blob;

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  showWebCam: boolean = true;
  showWebCamOptions: boolean = false;
  showImageCropper: boolean = false;

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
    const fileType = blob.type.split('/')[1];

    this.imageFile = new File(
      [blob],
      `${userId}_captured_image_${dateNow}.${fileType}`,
      {
        type: blob.type,
        lastModified: dateNow,
      }
    );

    console.log(this.imageFile.name);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  cropImage() {
    this.showImageCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob!;
    console.log(event.blob);
  }

  switchCamera() {
    this.showImageCropper = false;
    this.showWebCam = true;
    this.imageDataUrl = '';
  }

  async saveAsProfilePhoto(profile: Profile) {
    await this.profileService.uploadFile(
      this.imageFile,
      profile,
      !!profile.photoURL
    );
    this.closeClearDialog();
  }

  closeClearDialog() {
    this.imageDataUrl = '';
    this.imageFile = new File([], '', {
      type: '',
      lastModified: 0,
    });
    this.showWebCam = true;
    this.showWebCamOptions = this.showImageCropper = false;
    this.uiService.closeDialog(null);
  }
}
