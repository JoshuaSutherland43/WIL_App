import { FirebaseFirestoreService } from './FirebaseFirestoreService';
import { auth } from './firebase';

export type Report = {
  id: string;
  userId: string;
  title?: string;
  description: string;
  photos?: string[];
  location?: { latitude: number; longitude: number };
  createdAt?: string;
  updatedAt?: string;
};

const collectionPath = (userId: string) => `users/${userId}/reports`;

export const ReportsService = {
  async getReportsForUser(userId?: string): Promise<Report[]> {
    const uid = userId || auth?.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');
    const items = await FirebaseFirestoreService.getUserCollectionDocs<Report>(collectionPath(uid), 'createdAt', 'desc');
    return items.map((it) => ({
      ...it,
      createdAt: typeof (it as any).createdAt === 'string' ? (it as any).createdAt : new Date((it as any).createdAt?.seconds ? (it as any).createdAt.seconds * 1000 : Date.now()).toISOString(),
      updatedAt: typeof (it as any).updatedAt === 'string' ? (it as any).updatedAt : new Date((it as any).updatedAt?.seconds ? (it as any).updatedAt.seconds * 1000 : Date.now()).toISOString(),
    }));
  },

  async createReport(data: Omit<Report, 'id' | 'userId'>): Promise<string> {
    const uid = auth?.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');
    const toSave = {
      ...data,
      userId: uid,
    } as any;
    return FirebaseFirestoreService.addToUserCollection(collectionPath(uid), toSave);
  },
};
