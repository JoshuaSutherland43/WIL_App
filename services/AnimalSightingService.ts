import { FirebaseFirestoreService } from './FirebaseFirestoreService';
import { AnimalSighting } from '../types/sightings';
import { auth } from './firebase';

const collectionPath = (userId: string) => `users/${userId}/sightings`;

export const AnimalSightingService = {
  async getSightingsForUser(userId?: string): Promise<AnimalSighting[]> {
    const uid = userId || auth?.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');
    const items = await FirebaseFirestoreService.getUserCollectionDocs<AnimalSighting>(collectionPath(uid), 'timestamp', 'desc');
    return items.map((it) => ({
      ...it,
      // Normalize timestamp to ISO string
      timestamp: typeof (it as any).timestamp === 'string' ? (it as any).timestamp : new Date((it as any).timestamp?.seconds ? (it as any).timestamp.seconds * 1000 : Date.now()).toISOString(),
    }));
  },

  async createSighting(data: Omit<AnimalSighting, 'id' | 'photoUrl'> & { photoUri?: string }): Promise<string> {
    const uid = data.userId || auth?.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');

    const toSave: Omit<AnimalSighting, 'id'> = {
      userId: uid,
      animalName: data.animalName,
      description: data.description,
      photoUrl: data.photoUri, // if using storage later, replace with uploaded URL
      timestamp: data.timestamp,
      isDraft: data.isDraft,
      rideId: data.rideId,
      trailId: data.trailId,
      location: data.location,
      tags: data.tags,
    };

    return FirebaseFirestoreService.addToUserCollection(collectionPath(uid), toSave);
  },

  async getSightingById(userId: string | undefined, sightingId: string): Promise<AnimalSighting | null> {
    const uid = userId || auth?.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');
    const data = await FirebaseFirestoreService.getDocByPath<AnimalSighting>(`${collectionPath(uid)}/${sightingId}`);
    if (!data) return null;
    return {
      ...data,
      timestamp: typeof (data as any).timestamp === 'string' ? (data as any).timestamp : new Date((data as any).timestamp?.seconds ? (data as any).timestamp.seconds * 1000 : Date.now()).toISOString(),
    };
  },
};
