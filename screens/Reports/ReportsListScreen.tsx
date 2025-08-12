import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ReportsService, type Report } from '../../services/ReportsService';

export default function ReportsListScreen() {
  const navigation = useNavigation<any>();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = async () => {
    try {
      const items = await ReportsService.getReportsForUser();
      setReports(items);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Unable to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportCompose')} style={styles.composeBtn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}><Text>Loading reports...</Text></View>
      ) : reports.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No reports yet</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ReportCompose')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Create Report</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title || 'Report'}</Text>
                <Text style={styles.cardSub}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                </Text>
                {!!item.description && (
                  <Text numberOfLines={2} style={styles.cardDesc}>{item.description}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  composeBtn: { backgroundColor: '#4A90E2', width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#555' },
  primaryButton: { marginTop: 14, backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 2 },
  cardDesc: { fontSize: 14, color: '#333', marginTop: 6 },
});
