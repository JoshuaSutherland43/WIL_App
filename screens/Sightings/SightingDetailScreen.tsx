import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ThemedText } from '../../components/theme/ThemedText';
import type { AnimalSighting } from '../../types/sightings';
import { AnimalSightingService } from '../../services/AnimalSightingService';

export default function SightingDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sightingId } = route.params || {} as { sightingId: string };

  const [sighting, setSighting] = useState<AnimalSighting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!sightingId) {
          setError('No sighting ID provided.');
          return;
        }
        const data = await AnimalSightingService.getSightingById(undefined, String(sightingId));
        if (!data) setError('Sighting not found.');
        setSighting(data);
      } catch (e: any) {
        console.error('Failed to fetch sighting details:', e);
        setError(e?.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [sightingId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <ThemedText type="subtitle" style={{ color: 'red' }}>{error}</ThemedText>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.primaryButton}>
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!sighting) {
    return (
      <SafeAreaView style={styles.centered}>
        <ThemedText>Sighting data is not available.</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{sighting.animalName}</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {sighting.photoUrl ? (
          <Image source={{ uri: sighting.photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={50} color="#ccc" />
            <ThemedText>No Image Available</ThemedText>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} style={styles.icon} />
            <ThemedText style={styles.detailText}>
              {new Date(sighting.timestamp).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </ThemedText>
          </View>

          {!!sighting.description && (
            <View style={styles.detailItem}>
              <Ionicons name="document-text-outline" size={20} style={styles.icon} />
              <ThemedText style={styles.detailText}>{sighting.description}</ThemedText>
            </View>
          )}

          {!!sighting.location && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} style={styles.icon} />
              <ThemedText style={styles.detailText}>
                Lat: {sighting.location.latitude.toFixed(4)}, Lon: {sighting.location.longitude.toFixed(4)}
              </ThemedText>
            </View>
          )}

          {!!sighting.tags?.length && (
            <View style={styles.tagsSection}>
              <Ionicons name="pricetags-outline" size={20} style={styles.icon} />
              <View style={styles.tagsContainer}>
                {sighting.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  image: { width: '100%', height: 300, backgroundColor: '#f0f0f0' },
  imagePlaceholder: { width: '100%', height: 300, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  detailsContainer: { padding: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  icon: { marginRight: 15, color: '#555' },
  detailText: { fontSize: 16, flexShrink: 1, lineHeight: 24 },
  tagsSection: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  tag: { backgroundColor: '#E9E9F0', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 14 },
  primaryButton: { backgroundColor: '#4A90E2', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
