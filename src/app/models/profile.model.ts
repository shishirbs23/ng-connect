export interface Address {
  longDescription: string;
  city: string;
  state: string;
  division: string;
  country: string;
}

export interface EducationDetails {
  institutionName: string;
  startDate: string;
  endDate: string |  null;
  isCurrent: boolean;
  classes?: string;
  group?: string;
  fieldOfStudy?: string;
  degree?: string;
  description: string;
}

export interface Education {
  schools: EducationDetails[];
  colleges: EducationDetails[];
  universities: EducationDetails[];
}

export interface Profession {
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
  address?: Address;
  educationalHistory?: Education;
  professionalHistory?: Profession[];
  hobbies?: string[];
}
