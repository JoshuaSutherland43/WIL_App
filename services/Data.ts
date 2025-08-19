// Centralized app data models & (optional) Firestore converters.
// Keep this file framework-light so types can also be imported in non-Firebase contexts.
// NOTE: Only use converters if FIREBASE_ENABLED is true (see FirebaseAuthService).

import type { QueryDocumentSnapshot, FirestoreDataConverter, SnapshotOptions } from 'firebase/firestore';
import { FIREBASE_ENABLED, auth } from './FirebaseAuthService';

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

// ---------- Firestore Converters (Optional) ---------- //

function buildConverter<T extends { createdAt: number; updatedAt?: number }>(
	defaults: () => Partial<T> = () => ({})
): FirestoreDataConverter<T> {
	return {
		toFirestore(modelObject: T) {
			return { ...modelObject, updatedAt: Date.now() } as any;
		},
		fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
			const data = snapshot.data(options) as T;
			return { ...defaults(), ...data } as T;
		},
	};
}

export const Converters = FIREBASE_ENABLED
	? {
			userProfile: buildConverter<UserProfile>(() => ({ totalRides: 0, totalDistanceM: 0, totalDurationMs: 0, points: 0 })),
			ride: buildConverter<RideDTO>(),
			horse: buildConverter<HorseDTO>(),
			achievement: buildConverter<AchievementDTO>(),
			sosAlert: buildConverter<SosAlertDTO>(),
			notificationPrefs: buildConverter<NotificationPrefDTO>(),
		}
	: undefined;

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

// We import lazily inside functions to avoid throwing when firebase not configured.

type FS = typeof import('firebase/firestore');

function fs(): FS | undefined {
	if (!FIREBASE_ENABLED) return undefined;
	try {
		// Dynamic require keeps bundler happy if not used
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		return require('firebase/firestore');
	} catch {
		return undefined;
	}
}

// Generic collection helpers
export async function createDoc<T extends { id: string }>(col: string, data: T, converter?: FirestoreDataConverter<T>) {
	const f = fs();
	if (!f) return data; // local fallback
	const db = f.getFirestore();
	const ref = f.doc(f.collection(db, col), data.id).withConverter(converter || (undefined as any));
	await f.setDoc(ref, data as any, { merge: false });
	return data;
}

export async function upsertDoc<T extends { id: string }>(col: string, data: T, converter?: FirestoreDataConverter<T>) {
	const f = fs();
	if (!f) return data;
	const db = f.getFirestore();
	const ref = f.doc(f.collection(db, col), data.id).withConverter(converter || (undefined as any));
	await f.setDoc(ref, data as any, { merge: true });
	return data;
}

export async function getDocById<T>(col: string, id: string, converter?: FirestoreDataConverter<T>): Promise<T | null> {
	const f = fs();
	if (!f) return null;
	const db = f.getFirestore();
	const ref = f.doc(f.collection(db, col), id).withConverter(converter || (undefined as any));
	const snap = await f.getDoc(ref);
	return snap.exists() ? (snap.data() as T) : null;
}

export async function listDocs<T>(col: string, opts?: { where?: [string, any, any]; orderBy?: [string, ('asc' | 'desc')?]; limit?: number; converter?: FirestoreDataConverter<T> }): Promise<T[]> {
	const f = fs();
	if (!f) return [];
	const db = f.getFirestore();
	let q: any = f.collection(db, col);
	if (opts?.where) q = f.query(q, f.where(opts.where[0], opts.where[1], opts.where[2]));
		if (opts?.orderBy) {
			const dir = opts.orderBy[1];
			q = f.query(q, f.orderBy(opts.orderBy[0], dir === 'asc' || dir === 'desc' ? dir : undefined));
		}
	if (opts?.limit) q = f.query(q, f.limit(opts.limit));
	if (opts?.converter) q = q.withConverter(opts.converter);
	const snap = await f.getDocs(q);
	return snap.docs.map(d => d.data() as T);
}

// --------------------------------------------------------------------------
// Domain-Specific Helpers
// --------------------------------------------------------------------------

export async function saveRideAndUpdateAggregates(ride: RideDTO) {
	const f = fs();
	if (!f) return ride; // skip if firebase disabled
	const db = f.getFirestore();
	const batch = f.writeBatch(db);
	const rideRef = f.doc(f.collection(db, COLLECTIONS.rides), ride.id).withConverter(Converters?.ride as any);
	batch.set(rideRef, ride as any, { merge: false });

	// Update user aggregates transactionally (batch for simple increment pattern)
	const profRef = f.doc(f.collection(db, COLLECTIONS.users), ride.userId).withConverter(Converters?.userProfile as any);
	// We'll fetch profile to compute revised totals; use transaction for consistency
	await f.runTransaction(db, async (tx) => {
		const profSnap = await tx.get(profRef);
		let profile = profSnap.exists() ? (profSnap.data() as UserProfile) : newUserProfile({ uid: ride.userId });
		profile.totalRides += 1;
		profile.totalDistanceM += ride.totalDistance;
		profile.totalDurationMs += ride.duration;
		// Recompute points: 10 per ride + 1 per km (rounded)
		profile.points = profile.totalRides * 10 + Math.round(profile.totalDistanceM / 1000);
		profile.updatedAt = Date.now();
		tx.set(profRef, profile as any, { merge: true });
	});

	await batch.commit();
	return ride;
}

export async function recalcUserAggregates(userId: string) {
	const f = fs();
	if (!f) return null;
	const db = f.getFirestore();
	// Query all rides for the user (consider pagination if large)
	const q = f.query(
		f.collection(db, COLLECTIONS.rides),
		f.where('userId', '==', userId)
	);
	const snap = await f.getDocs(q);
	let totalRides = 0;
	let totalDistanceM = 0;
	let totalDurationMs = 0;
	snap.forEach(doc => {
		const r = doc.data() as RideDTO;
		totalRides += 1;
		totalDistanceM += r.totalDistance;
		totalDurationMs += r.duration;
	});
	const profile = newUserProfile({ uid: userId, totalRides, totalDistanceM, totalDurationMs, points: totalRides * 10 + Math.round(totalDistanceM / 1000) });
	const ref = f.doc(f.collection(db, COLLECTIONS.users), userId).withConverter(Converters?.userProfile as any);
	await f.setDoc(ref, profile as any, { merge: true });
	return profile;
}

export async function awardAchievement(userId: string, achievementId: string, meta?: Record<string, any>) {
	const f = fs();
	if (!f) return null;
	const db = f.getFirestore();
	const ref = f.doc(f.collection(db, COLLECTIONS.achievements), `${userId}_${achievementId}`).withConverter(Converters?.achievement as any);
	const snap = await f.getDoc(ref);
	if (snap.exists()) return snap.data();
	const ach = newAchievement({ id: achievementId, userId, meta });
	await f.setDoc(ref, ach as any);
	return ach;
}

export async function listUserAchievements(userId: string) {
	return listDocs<AchievementDTO>(COLLECTIONS.achievements, { where: ['userId', '==', userId] });
}

export async function setNotificationPrefs(prefs: NotificationPrefDTO) {
	const f = fs();
	if (!f) return prefs;
	const db = f.getFirestore();
	const ref = f.doc(f.collection(db, COLLECTIONS.notificationPrefs), prefs.userId).withConverter(Converters?.notificationPrefs as any);
	await f.setDoc(ref, prefs as any, { merge: true });
	return prefs;
}

export async function getNotificationPrefs(userId: string) {
	const f = fs();
	if (!f) return null;
	return getDocById<NotificationPrefDTO>(COLLECTIONS.notificationPrefs, userId, Converters?.notificationPrefs as any);
}


