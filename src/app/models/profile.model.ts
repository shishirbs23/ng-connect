export interface Profile {
  uid: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  photoName: string | null;
  coverPhotoURL: string | null;
  coverPhotoName: string | null;
  isEmailVerified: boolean | null;
  genderId: number | null;
  dob: string | null;
  privacyId: number;
}
