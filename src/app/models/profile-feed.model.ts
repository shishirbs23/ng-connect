export interface ProfileFeed {
  id: string;
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
}
