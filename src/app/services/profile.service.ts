import { Injectable, inject } from '@angular/core';

// Firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

// Auth
import { User, getAuth } from 'firebase/auth';

// Components
import { ProfileCompleteDialogComponent } from '../features/profile/profile-complete-dialog/profile-complete-dialog.component';

// Services
import { AppService } from '../core/services/app.service';
import { FileService } from '../core/services/file.service';
import { FormService } from '../core/services/form.service';
import { UiService } from '../core/services/ui.service';

// Models
import { AuthFormField } from '../models/formField.model';
import { Profile } from '../models/profile.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';
import { ENTITY } from '../utils/enums/entity.enum';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  auth = getAuth();
  storage = getStorage();
  field!: AuthFormField;

  appService = inject(AppService);
  uiService = inject(UiService);
  fileService = inject(FileService);
  formService = inject(FormService);

  profile!: Profile;
  loadingProfile: boolean = true;
  settingProfile: boolean = false;
  savingProfileImage: boolean = false;
  updatingProfileImage: boolean = false;
  deletingProfile: boolean = false;

  isEditable = {
    birthday: false,
    privacy: false,
  };

  profiles: Profile[] = [];
  loadingProfiles: boolean = true;

  getCurrentProfile() {
    this.loadingProfile = true;

    // Track Firebase Auth State Change
    this.auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // Get User Profile from Fire Store
        const profileRef = doc(
          this.appService._appDB,
          Collection.PROFILES,
          user.uid
        );

        const profileSnap = await getDoc(profileRef);
        const profile = profileSnap.data() as Profile;

        this.loadingProfile = false;

        this.profile = profile;

        if (!profile.displayName || !profile.genderId) {
          this.openProfileCompleteDialog(profile);
        }
      }
    });
  }

  prepareBirthdayForm() {
    this.isEditable.birthday = true;
    this.formService.prepareBirthdayForm(this.profile.dob!);
    this.field = {
      id: 4,
      isRequired: false,
      label: 'Birthday',
      name: 'dob',
    };
  }

  preparePrivacyForm() {
    this.isEditable.privacy = true;
    this.formService.preparePrivacyForm(this.profile.privacyId);
    this.field = {
      id: 10,
      isRequired: false,
      label: 'Privacy',
      name: 'privacyId',
      values: [
        {
          id: 1,
          label: 'Public',
          name: 'public',
        },
        {
          id: 2,
          label: 'Friends',
          name: 'friends',
        },
      ],
    };
  }

  openProfileCompleteDialog(profile: Profile) {
    this.uiService.openDialog(
      ProfileCompleteDialogComponent,
      {
        profile,
      },
      '350px',
      '300px'
    );
  }

  async setProfile(profileData: Profile, fromSignUp: boolean = false) {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      profileData.uid
    );

    this.settingProfile = true;

    await setDoc(profileRef, profileData, { merge: true })
      .then((_) => {
        this.profile = profileData;
        !fromSignUp && this.uiService.openSnackbar('Profile updated');
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          'Error during updating profile. Try after sometimes'
        );
      })
      .finally(() => {
        this.settingProfile = false;
        fromSignUp && this.uiService.closeDialog(null);
      });
  }

  onPictureChange(event: Event, profile: Profile, isUpdate?: boolean) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file: File = input.files[0];
      this.uploadFile(file, profile, isUpdate ?? false);
    }
  }

  async uploadFile(
    file: File,
    profile: Profile,
    isUpdate: boolean
  ): Promise<void> {
    const fileNameToDelete: string | null = profile.photoName;

    if (!this.fileService.isFileImage(file)) {
      this.uiService.openSnackbar(
        'Please upload a valid image file',
        true,
        2000
      );

      return;
    }

    // Using for loader
    this.savingProfileImage = true;

    if (isUpdate) {
      this.updatingProfileImage = true;
    }

    // Create the file path
    let filePath = `uploads/${profile.uid}/${file.name}`;

    // Get the file reference
    let fileRef = ref(this.storage, filePath);

    // Upload image to Cloud
    await uploadBytes(fileRef, file);

    // Get download URL
    const photoURL = await getDownloadURL(fileRef);

    // Save User Profile
    await this.setProfile({ ...profile, photoURL, photoName: file.name });

    // Setting Image data to show on UI
    profile.photoURL = photoURL;
    profile.photoName = file.name;

    this.savingProfileImage = false;

    if (isUpdate) {
      this.updatingProfileImage = false;
    }

    // Delete the existing photo from the storages
    if (fileNameToDelete) {
      this.deleteProfileImage(profile.uid, fileNameToDelete, false);
    }
  }

  async deleteProfileImage(
    userId: string,
    imageFileName: string,
    deleteCurrent: boolean = true
  ) {
    this.savingProfileImage = true;

    if (deleteCurrent) {
      this.profile.photoURL = this.profile.photoName = null;
      await this.setProfile(this.profile);
      this.uiService.openSnackbar('Profile photo has been removed');
    }

    const filePath: string = `uploads/${userId}/${imageFileName}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    await deleteObject(fileRef);

    this.savingProfileImage = false;
  }

  async getProfiles() {
    this.loadingProfiles = true;

    const profileCollection = collection(
      this.appService._appDB,
      Collection.PROFILES
    );
    const profileQuery = query(profileCollection, orderBy(ENTITY.DISPLAY_NAME));
    const profileSnap = await getDocs(profileQuery);

    this.profiles = profileSnap.docs.map(doc => doc.data()) as Profile[];

    this.loadingProfiles = false;
  }
}
