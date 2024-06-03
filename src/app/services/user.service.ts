import { Injectable, inject } from '@angular/core';

// Firebase
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Auth
import { UserProfile, getAuth } from 'firebase/auth';

// Services
import { AppService } from '../core/services/app.service';
import { UiService } from '../core/services/ui.service';

// Models
import { User } from '../models/user.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  auth = getAuth();
  storage = getStorage();

  appService = inject(AppService);
  uiService = inject(UiService);

  settingUserData: boolean = false;
  savingProfileImage: boolean = false;

  async setUserData(userData: User, fromSignUp: boolean = false) {
    const userRef = doc(
      this.appService._appDB,
      Collection.REGISTERED_USERS,
      userData.uid
    );

    this.settingUserData = true;
    await setDoc(userRef, userData, { merge: true });
    this.settingUserData = false;

    if (fromSignUp) {
      this.uiService.closeDialog(null);
    }
  }

  async uploadFile(file: File, user: User): Promise<void> {
    // Using for loader
    this.savingProfileImage = true;

    // Create the file path
    const filePath = `uploads/${user.uid}/${file.name}`;

    // Get the file reference
    const fileRef = ref(this.storage, filePath);

    // Upload image to Cloud
    await uploadBytes(fileRef, file);

    // Get download URL
    const photoURL = await getDownloadURL(fileRef);

    // Save User Profile
    this.setUserData({ ...user, photoURL });

    this.savingProfileImage = false;
  }
}
