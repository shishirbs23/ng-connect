export interface ProfileFeed {
  id: number;
  feeling: string;
  photos: {
    name: string;
    url: string;
  }[];
  checkIn: string;
  description: string;
  privacyId: number;
  createdAt: string;
  updatedAt: string;
  isExpanded: boolean;
}
