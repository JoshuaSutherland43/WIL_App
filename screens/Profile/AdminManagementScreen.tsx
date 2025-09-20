import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { FIREBASE_ENABLED, auth } from '../../services/FirebaseAuthService';
import { firestore } from '../../services/firebase';
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import type { UserProfile } from '../../services/Data';

export default function AdminManagementScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUseFirebase = FIREBASE_ENABLED && !!auth && !!firestore;

  const fetchUsers = useCallback(async () => {
    if (!canUseFirebase) return;
    try {
      setLoading(true);
      // Fetch all users ordered by createdAt; in real apps, paginate
      const q = query(collection(firestore!, 'users'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: UserProfile[] = [] as any;
      snap.forEach((d) => {
        const data = d.data() as any;
        list.push({
          uid: d.id,
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
        });
      });
      setUsers(list);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [canUseFirebase]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!canUseFirebase) return;
      try {
        const currentUid = auth?.currentUser?.uid;
        if (!currentUid) return;
        const myDoc = await (await import('firebase/firestore')).getDoc(doc(firestore!, 'users', currentUid));
        if (myDoc.exists()) {
          const data = myDoc.data() as any;
          setIsAdmin(data.role === 'admin' && data.status === 'approved');
        }
      } catch (e) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [canUseFirebase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const approveUser = async (target: UserProfile) => {
    if (!canUseFirebase) return;
    try {
      await updateDoc(doc(firestore!, 'users', target.uid), { status: 'approved' });
      await fetchUsers();
      Alert.alert('Approved', `${target.email || target.uid} has been approved.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to approve user');
    }
  };

  const rejectUser = async (target: UserProfile) => {
    if (!canUseFirebase) return;
    try {
      await updateDoc(doc(firestore!, 'users', target.uid), { status: 'rejected' });
      await fetchUsers();
      Alert.alert('Rejected', `${target.email || target.uid} has been rejected.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to reject user');
    }
  };

  if (!canUseFirebase) {
    return (
      <SafeAreaView style={styles.center}> 
        <Text>Firebase is disabled. Configure environment variables to enable admin management.</Text>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Admins only. You must be signed in as an approved admin.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity onPress={fetchUsers} style={styles.refresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.email}>{item.email || '—'}</Text>
                <Text style={styles.meta}>{item.displayName || item.uid}</Text>
                <Text style={styles.meta}>Role: {item.role || 'user'} · Status: {item.status || 'pending'}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, styles.approve]}
                  onPress={() => approveUser(item)}
                  disabled={item.status === 'approved'}
                >
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.reject]}
                  onPress={() => rejectUser(item)}
                  disabled={item.status === 'rejected'}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  refresh: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  refreshText: { fontWeight: '600' },
  error: { color: 'red' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ddd' },
  email: { fontWeight: '700' },
  meta: { color: '#555', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  approve: { backgroundColor: '#16a34a' },
  reject: { backgroundColor: '#dc2626' },
  btnText: { color: '#fff', fontWeight: '700' },
});
