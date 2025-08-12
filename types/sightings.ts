export type SightingLocation = {
  latitude: number;
  longitude: number;
};

export type AnimalSighting = {
  id: string;
  userId: string;
  animalName: string;
  description?: string;
  photoUrl?: string;
  timestamp: string; // ISO string
  isDraft?: boolean;
  rideId?: string;
  trailId?: string;
  location?: SightingLocation;
  tags?: string[];
};
