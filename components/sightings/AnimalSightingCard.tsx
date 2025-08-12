import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../theme/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { AnimalSighting } from '../../types/sightings';

interface Props {
  sighting: AnimalSighting;
}

export default function AnimalSightingCard({ sighting }: Props) {
  const navigation = useNavigation<any>();
  const handlePress = () => {
    navigation.navigate('SightingDetail', { sightingId: sighting.id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      {sighting.photoUrl ? (
        <Image source={{ uri: sighting.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="leaf-outline" size={30} color="#ccc" />
        </View>
      )}
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle" style={styles.animalName}>{sighting.animalName}</ThemedText>
        <ThemedText style={styles.dateText}>
          {new Date(sighting.timestamp).toLocaleDateString()} at {new Date(sighting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
        {sighting.description && (
          <ThemedText numberOfLines={2} style={styles.descriptionText}>
            {sighting.description}
          </ThemedText>
        )}
        {sighting.location && (
          <ThemedText style={styles.locationText} numberOfLines={1}>
            <Ionicons name="location-sharp" size={12} /> Lat: {sighting.location.latitude.toFixed(2)}, Lon: {sighting.location.longitude.toFixed(2)}
          </ThemedText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#e9e9e9',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  animalName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
  },
  locationText: {
    fontSize: 11,
    color: '#777',
    marginTop: 3,
  },
  chevron: {
    marginLeft: 8,
  },
});
