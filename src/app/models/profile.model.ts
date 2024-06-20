interface Address {
  longDescription: string;
  city: string;
  state: string;
  country: string;
}

interface BasicInfo {
  address: Address;
  genderId: number;
  birthday: string;
  emailAddress: string;
  phoneNumber: string;
}

interface SchoolCollege {
  fromClass: string;
  toClass: string;
  fromDate: string;
  toDate: string;
  institutionName: string;
}

interface University {
  degreeName: string;
  fromDate: string;
  toDate: string;
  institutionName: string;
}

interface Education {
  schools: SchoolCollege[];
  colleges: SchoolCollege[];
  universities: University[];
}

interface Profession {
  designation: string;
  fromDate: string;
  toDate: string;
  companyName: string;
}
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
  phoneNumber: string | null;
  genderId: number | null;
  dob: string | null;
  privacyId: number;
  bio?: string;
  basicInfo?: BasicInfo;
  educationalHistory?: Education;
  professionalHistory?: Profession[];
  hobbies?: string[];
}
