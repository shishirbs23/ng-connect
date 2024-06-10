export interface Profile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  photoName: string | null;
  isEmailVerified: boolean | null;
  genderId: number | null;
  dob: string | null;
  privacyId: number;
}
