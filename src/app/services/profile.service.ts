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
import { Entity } from '../utils/enums/entity.enum';
import { SearchType } from '../utils/enums/search-type.enum';
import { PictureOption } from '../utils/enums/picture-option.enum';

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
  savingProfilePhoto: boolean = false;
  updatingProfilePhoto: boolean = false;
  savingCoverPhoto: boolean = false;
  updatingCoverPhoto: boolean = false;
  deletingProfile: boolean = false;
  isMyProfile: boolean = false;

  isEditable = {
    birthday: false,
    privacy: false,
  };

  profiles: Profile[] = [];
  loadingProfiles: boolean = true;
  showFriends: boolean = false;

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

  async getProfileFromDb(userId: string) {
    this.isMyProfile = userId === this.appService.userId;

    this.loadingProfile = true;

    const profileRef = doc(this.appService._appDB, Collection.PROFILES, userId);

    const profileSnap = await getDoc(profileRef);
    const profile = profileSnap.data() as Profile;

    this.loadingProfile = false;

    this.profile = profile;

    console.log(profile);

    if (this.isMyProfile && (!profile.displayName || !profile.genderId)) {
      this.openProfileCompleteDialog(profile);
    }
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

  onPictureChange(
    event: Event,
    profile: Profile,
    pictureOption: string,
    isUpdate?: boolean
  ) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file: File = input.files[0];
      this.uploadFile(file, profile, pictureOption, isUpdate ?? false);
    }
  }

  async uploadFile(
    file: File,
    profile: Profile,
    pictureOption: string,
    isUpdate: boolean
  ): Promise<void> {
    const fileNameToDelete: string | null =
      pictureOption === PictureOption.PROFILE_PHOTO
        ? profile.photoName
        : profile.coverPhotoName;

    if (!this.fileService.isFileImage(file)) {
      this.uiService.openSnackbar(
        'Please upload a valid image file',
        true,
        2000
      );

      return;
    }

    // Using for loader
    if (pictureOption === PictureOption.PROFILE_PHOTO) {
      this.savingProfilePhoto = true;
    } else {
      this.savingCoverPhoto = true;
    }

    if (isUpdate) {
      if (pictureOption === PictureOption.PROFILE_PHOTO) {
        this.updatingProfilePhoto = true;
      } else {
        this.updatingCoverPhoto = true;
      }
    }

    // Create the file path
    let filePath = `uploads/${profile.uid}/${file.name}`;

    // Get the file reference
    let fileRef = ref(this.storage, filePath);

    // Upload image to Cloud
    await uploadBytes(fileRef, file);

    // Get download URL
    const url = await getDownloadURL(fileRef);

    // Save User Profile
    pictureOption === PictureOption.PROFILE_PHOTO
      ? await this.setProfile({
          ...profile,
          photoURL: url,
          photoName: file.name,
        })
      : await this.setProfile({
          ...profile,
          coverPhotoURL: url,
          coverPhotoName: file.name,
        });

    // Setting Image data to show on UI
    if (pictureOption === PictureOption.PROFILE_PHOTO) {
      profile.photoURL = url;
      profile.photoName = file.name;
      this.savingProfilePhoto = false;

      if (isUpdate) {
        this.updatingProfilePhoto = false;
      }

      if (fileNameToDelete) {
        this.deleteProfilePhoto(profile.uid, fileNameToDelete, false);
      }
    } else {
      profile.coverPhotoURL = url;
      profile.coverPhotoName = file.name;
      this.savingCoverPhoto = false;

      if (isUpdate) {
        this.updatingCoverPhoto = false;
      }

      if (fileNameToDelete) {
        this.deleteCoverPhoto(profile.uid, fileNameToDelete, false);
      }
    }
  }

  async deleteProfilePhoto(
    userId: string,
    imageFileName: string,
    deleteCurrent: boolean = true
  ) {
    this.savingProfilePhoto = true;

    if (deleteCurrent) {
      this.profile.photoURL = this.profile.photoName = null;
      await this.setProfile(this.profile);
      this.uiService.openSnackbar('Profile photo has been removed');
    }

    const filePath: string = `uploads/${userId}/${imageFileName}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    await deleteObject(fileRef);

    this.savingProfilePhoto = false;
  }

  async deleteCoverPhoto(
    userId: string,
    imageFileName: string,
    deleteCurrent: boolean = true
  ) {
    this.savingCoverPhoto = true;

    if (deleteCurrent) {
      this.profile.coverPhotoURL = this.profile.coverPhotoName = null;
      await this.setProfile(this.profile);
      this.uiService.openSnackbar('Cover photo has been removed');
    }

    const filePath: string = `uploads/${userId}/${imageFileName}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    await deleteObject(fileRef);

    this.savingCoverPhoto = false;
  }

  async getProfilesFriends(getFriends: boolean = false) {
    this.loadingProfiles = true;

    let dataCollection;

    if (getFriends) {
      const userDocRef = doc(
        this.appService._appDB,
        Collection.FRIENDS,
        this.appService.userId
      );
      dataCollection = collection(userDocRef, Collection.FRIENDS);
    } else {
      dataCollection = collection(this.appService._appDB, Collection.PROFILES);
    }

    const dataQuery = query(dataCollection, orderBy(Entity.DISPLAY_NAME));
    const dataSnap = await getDocs(dataQuery);

    this.profiles = dataSnap.docs.map((doc) => doc.data()) as Profile[];

    this.loadingProfiles = false;
  }

  filterWithFriends() {
    this.showFriends = !this.showFriends;
    this.getProfilesFriends(this.showFriends);
  }
}
