// Centralized app data models & (optional) Firestore converters.
// Keep this file framework-light so types can also be imported in non-Firebase contexts.
// NOTE: Only use converters if FIREBASE_ENABLED is true (see FirebaseAuthService).

import {
	getFirestore,
	doc,
	collection,
	setDoc,
	getDoc,
	getDocs,
	query as fsQuery,
	where as fsWhere,
	orderBy as fsOrderBy,
	limit as fsLimit,
	writeBatch,
	runTransaction,
	type QueryDocumentSnapshot,
	type FirestoreDataConverter,
	type SnapshotOptions,
	type DocumentReference,
	type Query,
} from 'firebase/firestore';
import { FIREBASE_ENABLED, auth, app } from './FirebaseAuthService';
import { User } from 'firebase/auth';

// ---------- Firestore Helpers ---------- //

/**
 * Gets a typed document reference with a converter.
 * @param collectionPath The path to the collection.
 * @param docId The document ID.
 * @param converter The FirestoreDataConverter.
 * @returns A DocumentReference for the typed document.
 */
function getTypedDocRef<T>(collectionPath: string, docId: string, converter: FirestoreDataConverter<T>) {
	if (!FIREBASE_ENABLED || !app) throw new Error('Firebase is not enabled.');
	const db = getFirestore(app);
	return doc(db, collectionPath, docId).withConverter(converter);
}

/**
 * Creates a user profile if it doesn't exist.
 * @param user The Firebase Auth user object.
 * @returns The user's profile, either existing or newly created.
 */
export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
	const userRef = getTypedDocRef<UserProfile>('users', user.uid, userProfileConverter);
	const userSnap = await getDoc(userRef);

	if (userSnap.exists()) {
		return userSnap.data();
	} else {
		const newUserProfile: UserProfile = {
			uid: user.uid,
			email: user.email || undefined,
			displayName: user.displayName || undefined,
			photoURL: user.photoURL || undefined,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			role: 'user',
			status: 'pending',
			totalRides: 0,
			totalDistanceM: 0,
			totalDurationMs: 0,
			points: 0,
		};
		await setDoc(userRef, newUserProfile);
		return newUserProfile;
	}
}

// ---------- Admin/User Management Helpers ---------- //

/**
 * Fetches user profiles with optional status filtering and basic pagination.
 */
export async function listUserProfiles(options?: { status?: UserProfile['status']; limit?: number }): Promise<UserProfile[]> {
	if (!FIREBASE_ENABLED || !app) return [];
	const db = getFirestore(app);
	let q: Query = fsQuery(collection(db, 'users'));
	if (options?.status) {
		q = fsQuery(collection(db, 'users'), fsWhere('status', '==', options.status));
	}
	const lim = options?.limit ?? 100;
	q = fsQuery(collection(db, 'users'), fsOrderBy('createdAt', 'desc'), fsLimit(lim));
	const snap = await getDocs(q);
	const res: UserProfile[] = [];
	snap.forEach((d) => {
		const data = d.data();
		res.push({
			uid: d.id,
			displayName: (data as any).displayName,
			email: (data as any).email,
			photoURL: (data as any).photoURL,
			createdAt: (data as any).createdAt,
			updatedAt: (data as any).updatedAt,
			role: (data as any).role,
			status: (data as any).status,
			totalRides: (data as any).totalRides || 0,
			totalDistanceM: (data as any).totalDistanceM || 0,
			totalDurationMs: (data as any).totalDurationMs || 0,
			points: (data as any).points || 0,
		});
	});
	return res;
}

export async function setUserApproval(userId: string, status: NonNullable<UserProfile['status']>) {
	if (!FIREBASE_ENABLED || !app) return;
	const db = getFirestore(app);
	const ref = doc(db, 'users', userId);
	await setDoc(ref, { status, updatedAt: Date.now() } as any, { merge: true });
}

// ---------- Core Primitive Types ---------- //

export type TimestampMs = number; // epoch millis
export type UUID = string;

// ---------- User Profile ---------- //

export interface UserProfile {
	uid: string;            // firebase auth uid
	displayName?: string;
	email?: string;
	photoURL?: string;
	createdAt: TimestampMs;
	updatedAt: TimestampMs;
	role?: 'user' | 'admin';
	status?: 'pending' | 'approved' | 'rejected';
	// Aggregate ride stats (denormalized for fast profile display)
	totalRides: number;
	totalDistanceM: number; // meters
	totalDurationMs: number;
	points: number;         // gamified points (rides*10 + km, etc.)
}

// ---------- Ride / Tracking ---------- //

export interface RidePointDTO {
	lat: number;
	lng: number;
	alt: number;
	t: number; // timestamp ms
}

export interface RideDTO {
	id: UUID;
	userId: string;
	horseId?: string | null;
	startTime: TimestampMs;
	endTime: TimestampMs;
	totalDistance: number;      // meters
	elevationGain: number;      // meters
	duration: number;           // ms
	path: RidePointDTO[];       // simplified path list
	routeDistances?: Record<string, number>; // per predefined route id (meters)
	createdAt: TimestampMs;
	updatedAt: TimestampMs;
	// Optional summary fields (can be recalculated if missing)
	avgSpeedMps?: number;
	maxSpeedMps?: number;
}

// ---------- Horses ---------- //

export interface HorseDTO {
	id: UUID;
	userId: string;        // owner
	name: string;
	breed?: string;
	age?: number;
	notes?: string;
	createdAt: TimestampMs;
	updatedAt: TimestampMs;
	retired?: boolean;
}

// ---------- Achievements ---------- //

export interface AchievementDTO {
	id: string;               // stable id e.g. FIRST_RIDE
	userId: string;
	earnedAt: TimestampMs;
	meta?: Record<string, any>; // optional additional info
	createdAt: TimestampMs;     // duplicate of earnedAt (for uniform indexing)
	updatedAt: TimestampMs;
}

// ---------- SOS Alert / Emergency ---------- //

export interface SosAlertDTO {
	id: UUID;
	userId: string;
	createdAt: TimestampMs;
	resolvedAt?: TimestampMs;
	status: 'open' | 'resolved' | 'cancelled';
	lastLocation?: { lat: number; lng: number }; // last known location
	notes?: string;
}

// ---------- Notifications (local or remote) ---------- //

export interface NotificationPrefDTO {
	userId: string;
	allowPush: boolean;
	allowEmail: boolean;
	createdAt: TimestampMs;
	updatedAt: TimestampMs;
}

// ---------- Sightings (users/{uid}/sightings) ---------- //

export interface SightingDTO {
	id: UUID;
	userId: string;
	animalName: string; // e.g. "dog"
	description?: string;
	location: { latitude: number; longitude: number };
	photoUrl?: string;
	timestamp: string; 
	createdAt: TimestampMs;
	updatedAt: TimestampMs;
}

// ---------- Utility Creators ---------- //

const now = () => Date.now();
const currentUid = () => (FIREBASE_ENABLED ? auth?.currentUser?.uid : undefined);

export function newUserProfile(partial: Partial<UserProfile> & { uid: string }): UserProfile {
	const ts = now();
	return {
		displayName: '',
		email: '',
		photoURL: undefined,
		totalRides: 0,
		totalDistanceM: 0,
		totalDurationMs: 0,
		points: 0,
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as UserProfile;
}

export function newRide(partial: Partial<RideDTO> & { id: UUID; startTime: number }): RideDTO {
	const ts = now();
	const end = partial.endTime ?? partial.startTime ?? ts;
	return {
		userId: currentUid() || 'local',
		horseId: null,
		endTime: end,
		totalDistance: 0,
		elevationGain: 0,
		duration: end - partial.startTime,
		path: [],
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as RideDTO;
}

export function newHorse(partial: Partial<HorseDTO> & { id: UUID; name: string }): HorseDTO {
	const ts = now();
	return {
		userId: currentUid() || 'local',
		breed: undefined,
		age: undefined,
		notes: undefined,
		retired: false,
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as HorseDTO;
}

export function newAchievement(partial: Partial<AchievementDTO> & { id: string }): AchievementDTO {
	const ts = now();
	return {
		userId: currentUid() || 'local',
		earnedAt: ts,
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as AchievementDTO;
}

export function newSosAlert(partial: Partial<SosAlertDTO> & { id: UUID }): SosAlertDTO {
	const ts = now();
	return {
		userId: currentUid() || 'local',
		createdAt: ts,
		status: 'open',
		...partial,
	} as SosAlertDTO;
}

export function newNotificationPrefs(partial: Partial<NotificationPrefDTO> & { userId: string }): NotificationPrefDTO {
	const ts = now();
	return {
		allowPush: true,
		allowEmail: false,
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as NotificationPrefDTO;
}

export function newSighting(partial: Partial<SightingDTO> & { id: UUID; animalName: string; location: { latitude: number; longitude: number } }): SightingDTO {
	const ts = now();
	return {
		userId: currentUid() || 'local',
		description: undefined,
		photoUrl: undefined,
		timestamp: new Date(ts).toISOString(),
		createdAt: ts,
		updatedAt: ts,
		...partial,
	} as SightingDTO;
}

// ---------- Firestore Converters ---------- //

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
	toFirestore: (profile: UserProfile) => {
		const data = { ...profile };
		// The uid is the doc id, so we don't need to store it in the document.
		delete (data as any).uid;
		// Firestore rejects undefined; strip them
		Object.keys(data).forEach((k) => {
			if ((data as any)[k] === undefined) delete (data as any)[k];
		});
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserProfile => {
		const data = snapshot.data(options);
		return {
			uid: snapshot.id,
			displayName: data.displayName,
			email: data.email,
			photoURL: data.photoURL,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			role: data.role,
			status: data.status,
			totalRides: data.totalRides || 0,
			totalDistanceM: data.totalDistanceM || 0,
			totalDurationMs: data.totalDurationMs || 0,
			points: data.points || 0,
		};
	},
};

export const rideConverter: FirestoreDataConverter<RideDTO> = {
	toFirestore: (ride: RideDTO) => {
		const data = { ...ride };
		delete (data as any).id; // Use document ID for ride ID
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): RideDTO => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		} as RideDTO;
	},
};

export const horseConverter: FirestoreDataConverter<HorseDTO> = {
	toFirestore: (horse: HorseDTO) => {
		const data = { ...horse };
		delete (data as any).id;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): HorseDTO => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		} as HorseDTO;
	},
};

export const achievementConverter: FirestoreDataConverter<AchievementDTO> = {
	toFirestore: (achievement: AchievementDTO) => {
		const data = { ...achievement };
		delete (data as any).id;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): AchievementDTO => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		} as AchievementDTO;
	},
};

export const sosAlertConverter: FirestoreDataConverter<SosAlertDTO> = {
	toFirestore: (alert: SosAlertDTO) => {
		const data = { ...alert };
		delete (data as any).id;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SosAlertDTO => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		} as SosAlertDTO;
	},
};

export const notificationPrefConverter: FirestoreDataConverter<NotificationPrefDTO> = {
	toFirestore: (prefs: NotificationPrefDTO) => {
		const data = { ...prefs };
		// The userId is the doc id, so we don't need to store it in the document.
		delete (data as any).userId;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): NotificationPrefDTO => {
		const data = snapshot.data(options);
		return {
			userId: snapshot.id,
			allowPush: data.allowPush,
			allowEmail: data.allowEmail,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		};
	},
};

export const sightingConverter: FirestoreDataConverter<SightingDTO> = {
	toFirestore: (sighting: SightingDTO) => {
		const data = { ...sighting };
		delete (data as any).id;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SightingDTO => {
		const data = snapshot.data(options);
		return {
			...data,
			id: snapshot.id,
		} as SightingDTO;
	},
};

// ---------- Collection name helpers ---------- //

export const COLLECTIONS = {
	users: 'users',
	rides: 'rides',
	horses: 'horses',
	achievements: 'achievements',
	sosAlerts: 'sos_alerts',
	notificationPrefs: 'notification_prefs',
};

// ---------- Type Guards ---------- //

export function isRide(obj: any): obj is RideDTO {
	return obj && typeof obj === 'object' && 'startTime' in obj && Array.isArray(obj.path);
}

export function isHorse(obj: any): obj is HorseDTO {
	return obj && typeof obj === 'object' && 'name' in obj && 'userId' in obj;
}

export function isUserProfile(obj: any): obj is UserProfile {
	return obj && typeof obj === 'object' && 'uid' in obj && 'createdAt' in obj;
}

// ---------- Mappers (Local <-> Firebase) ---------- //

export function ridePointToDTO(p: { latitude: number; longitude: number; altitude: number; timestamp: number }): RidePointDTO {
	return { lat: p.latitude, lng: p.longitude, alt: p.altitude, t: p.timestamp };
}

export function ridePointFromDTO(p: RidePointDTO) {
	return { latitude: p.lat, longitude: p.lng, altitude: p.alt, timestamp: p.t };
}

export function calculateRideSummary(ride: RideDTO): RideDTO {
	if (ride.duration <= 0) return ride;
	const avg = ride.totalDistance / (ride.duration / 1000);
	return { ...ride, avgSpeedMps: avg };
}

// Future: add aggregation helpers (e.g., updateUserAggregatesFromRide)

// ============================================================================
// Firestore CRUD Helpers (safe no-ops if FIREBASE_ENABLED is false)
// ============================================================================

// We now use direct static imports so Firestore service registers correctly.
// All helpers guard on FIREBASE_ENABLED & app presence.

// Generic collection helpers
export async function createDoc<T extends { id: string }>(colName: string, data: T, converter?: FirestoreDataConverter<T>) {
	if (!FIREBASE_ENABLED || !app) return data; // local fallback
	const db = getFirestore(app);
	const ref = doc(collection(db, colName), data.id).withConverter(converter || (undefined as any));
	await setDoc(ref, data, { merge: false });
	return data;
}

export async function upsertDoc<T extends { id: string }>(colName: string, data: T, converter?: FirestoreDataConverter<T>) {
	if (!FIREBASE_ENABLED || !app) return data;
	const db = getFirestore(app);
	const ref = doc(collection(db, colName), data.id).withConverter(converter || (undefined as any));
	await setDoc(ref, data, { merge: true });
	return data;
}

export async function getDocById<T>(colName: string, id: string, converter?: FirestoreDataConverter<T>): Promise<T | null> {
	if (!FIREBASE_ENABLED || !app) return null;
	const db = getFirestore(app);
	const ref = doc(collection(db, colName), id).withConverter(converter || (undefined as any));
	const snap = await getDoc(ref);
	return snap.exists() ? (snap.data() as T) : null;
}

export async function listDocs<T>(
	colName: string,
	opts?: { where?: [string, any, any]; orderBy?: [string, 'asc' | 'desc' | undefined]; limit?: number; converter?: FirestoreDataConverter<T> }
): Promise<T[]> {
	if (!FIREBASE_ENABLED || !app) return [];
	const db = getFirestore(app);
	let q: any = collection(db, colName);
	if (opts?.where) q = fsQuery(q, fsWhere(opts.where[0], opts.where[1], opts.where[2]));
	if (opts?.orderBy) {
		const dir = opts.orderBy[1];
		q = fsQuery(q, fsOrderBy(opts.orderBy[0], dir === 'asc' || dir === 'desc' ? dir : undefined));
	}
	if (opts?.limit) q = fsQuery(q, fsLimit(opts.limit));
	if (opts?.converter) q = q.withConverter(opts.converter);
	const snap = await getDocs(q);
	return snap.docs.map(d => d.data() as T);
}

// --------------------------------------------------------------------------
// Domain-Specific Helpers
// --------------------------------------------------------------------------

export async function saveRideAndUpdateAggregates(ride: RideDTO) {
	if (!FIREBASE_ENABLED || !app) return ride;
	const db = getFirestore(app);
	const batch = writeBatch(db);
	const rideRef = doc(collection(db, COLLECTIONS.rides), ride.id).withConverter(rideConverter);
	batch.set(rideRef, ride, { merge: false });

	const profRef = doc(collection(db, COLLECTIONS.users), ride.userId).withConverter(userProfileConverter);
	await runTransaction(db, async (tx) => {
		const profSnap = await tx.get(profRef);
		let profile = profSnap.exists() ? profSnap.data() : newUserProfile({ uid: ride.userId });
		profile.totalRides += 1;
		profile.totalDistanceM += ride.totalDistance;
		profile.totalDurationMs += ride.duration;
		profile.points = profile.totalRides * 10 + Math.round(profile.totalDistanceM / 1000);
		profile.updatedAt = Date.now();
		tx.set(profRef, profile, { merge: true });
	});

	await batch.commit();
	return ride;
}

export async function recalcUserAggregates(userId: string) {
	if (!FIREBASE_ENABLED || !app) return null;
	const db = getFirestore(app);
	const q = fsQuery(collection(db, COLLECTIONS.rides), fsWhere('userId', '==', userId));
	const snap = await getDocs(q);
	let totalRides = 0;
	let totalDistanceM = 0;
	let totalDurationMs = 0;
	snap.forEach(docSnap => {
		const r = docSnap.data() as RideDTO;
		totalRides += 1;
		totalDistanceM += r.totalDistance;
		totalDurationMs += r.duration;
	});
	const profile = newUserProfile({ uid: userId, totalRides, totalDistanceM, totalDurationMs, points: totalRides * 10 + Math.round(totalDistanceM / 1000) });
	const ref = doc(collection(db, COLLECTIONS.users), userId).withConverter(userProfileConverter);
	await setDoc(ref, profile, { merge: true });
	return profile;
}


export async function awardAchievement(userId: string, achievementId: string, meta?: Record<string, any>) {
	if (!FIREBASE_ENABLED || !app) return null;
	const db = getFirestore(app);
	const ref = doc(collection(db, COLLECTIONS.achievements), `${userId}_${achievementId}`).withConverter(achievementConverter);
	const snap = await getDoc(ref);
	if (snap.exists()) return snap.data();
	const ach = newAchievement({ id: achievementId, userId, meta });
	await setDoc(ref, ach);
	return ach;
}

export async function listUserAchievements(userId: string) {
	return listDocs<AchievementDTO>(COLLECTIONS.achievements, { where: ['userId', '==', userId] });
}

export async function setNotificationPrefs(prefs: NotificationPrefDTO) {
	if (!FIREBASE_ENABLED || !app) return prefs;
	const db = getFirestore(app);
	const ref = doc(collection(db, COLLECTIONS.notificationPrefs), prefs.userId).withConverter(notificationPrefConverter);
	await setDoc(ref, prefs, { merge: true });
	return prefs;
}

export async function getNotificationPrefs(userId: string) {
	if (!FIREBASE_ENABLED || !app) return null;
	return getDocById<NotificationPrefDTO>(COLLECTIONS.notificationPrefs, userId, notificationPrefConverter);
}

// --------------------------------------------------------------------------
// Sightings: users/{uid}/sightings helpers
// --------------------------------------------------------------------------

function userSightingsCol(db: any, uid: string) {
	return collection(db, COLLECTIONS.users, uid, 'sightings');
}

export async function createSighting(uid: string, sighting: SightingDTO) {
	if (!FIREBASE_ENABLED || !app) return sighting;
	const db = getFirestore(app);
	const ref = doc(userSightingsCol(db, uid), sighting.id).withConverter(sightingConverter);
	await setDoc(ref, sighting, { merge: false });
	return sighting;
}

export async function upsertSighting(uid: string, sighting: SightingDTO) {
	if (!FIREBASE_ENABLED || !app) return sighting;
	const db = getFirestore(app);
	const ref = doc(userSightingsCol(db, uid), sighting.id).withConverter(sightingConverter);
	await setDoc(ref, { ...sighting, updatedAt: Date.now() }, { merge: true });
	return sighting;
}

export async function getSighting(uid: string, id: string): Promise<SightingDTO | null> {
	if (!FIREBASE_ENABLED || !app) return null;
	const db = getFirestore(app);
	const ref = doc(userSightingsCol(db, uid), id).withConverter(sightingConverter);
	const snap = await getDoc(ref);
	return snap.exists() ? snap.data() : null;
}

export async function listSightings(
	uid: string,
	opts?: { limit?: number; orderBy?: [keyof SightingDTO & string, ('asc' | 'desc')?] }
): Promise<SightingDTO[]> {
	if (!FIREBASE_ENABLED || !app) return [];
	const db = getFirestore(app);
	let q: Query<SightingDTO> = userSightingsCol(db, uid).withConverter(sightingConverter);
	if (opts?.orderBy) {
		const dir = opts.orderBy[1];
		q = fsQuery(q, fsOrderBy(opts.orderBy[0], dir === 'asc' || dir === 'desc' ? dir : undefined));
	}
	if (opts?.limit) q = fsQuery(q, fsLimit(opts.limit));
	const snap = await getDocs(q);
	return snap.docs.map(d => d.data());
}

export async function deleteSighting(uid: string, id: string) {
	if (!FIREBASE_ENABLED || !app) return true;
	const db = getFirestore(app);
	const ref = doc(userSightingsCol(db, uid), id);
	// deleteDoc not imported directly earlier; import now if needed
	const { deleteDoc } = await import('firebase/firestore');
	await deleteDoc(ref);
	return true;
}
