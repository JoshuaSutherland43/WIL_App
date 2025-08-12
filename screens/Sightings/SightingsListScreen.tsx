import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { ThemedText } from '../../components/theme/ThemedText';
import AnimalSightingCard from '../../components/sightings/AnimalSightingCard';
import { AnimalSightingService } from '../../services/AnimalSightingService';
import type { AnimalSighting } from '../../types/sightings';

export default function SightingsListScreen() {
  const navigation = useNavigation<any>();
  const [sightings, setSightings] = useState<AnimalSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSightings = async () => {
    try {
      const userSightings = await AnimalSightingService.getSightingsForUser();
      setSightings(userSightings);
    } catch (error) {
      console.error('Error loading sightings:', error);
      Alert.alert('Error', 'Failed to load sightings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSightings();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadSightings();
  };

  const handleAddSighting = () => {
    navigation.navigate('AddSighting');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText style={styles.centeredText}>Loading sightings...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">My Animal Sightings</ThemedText>
        <TouchableOpacity onPress={handleAddSighting} style={styles.addButton}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {sightings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>No animal sightings yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Start documenting wildlife you encounter on your trails
          </ThemedText>
          <TouchableOpacity onPress={handleAddSighting} style={styles.primaryButton}>
            <ThemedText style={styles.buttonText}>Add Your First Sighting</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sightings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalSightingCard sighting={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centeredText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
