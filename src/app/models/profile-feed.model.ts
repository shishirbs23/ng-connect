export interface ProfileFeed {
  id: number;
  feeling: string;
  photos: {
    photoName: string;
    photoUrl: string;
  }[];
  checkIn: string;
  description: string;
  privacyId: number;
  createdAt: string;
  updatedAt: string;
  isExpanded: boolean;
}
