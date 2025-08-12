import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ThemedText } from '../../components/theme/ThemedText';
import { AnimalSightingService } from '../../services/AnimalSightingService';
import type { AnimalSighting } from '../../types/sightings';

const quickTags = [
  { name: '#Wild', color: '#A0E7E5', textColor: '#000' },
  { name: '#Rare', color: '#B4F8C8', textColor: '#000' },
  { name: '#Forest', color: '#D8BFD8', textColor: '#000' },
  { name: '#Daytime', color: '#FBE7C6', textColor: '#000' },
  { name: '#Urgent', color: '#FFAEBC', textColor: '#000' },
  { name: '#NewSpecies', color: '#B2B2B2', textColor: '#fff' },
];

export default function AddSightingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { trailId, rideId } = route.params || {};

  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<{ uri: string; width?: number; height?: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
          Alert.alert('Permissions required', 'Camera and photo library access is needed to add sightings.');
        }
      }
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is needed to tag sighting location.');
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description.');
      return;
    }
    if (!photo) {
      Alert.alert('Missing Information', 'Please add or select a photo for the sighting.');
      return;
    }

    setIsSubmitting(true);
    try {
      let currentLocation: Location.LocationObject | null = null;
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          currentLocation = await Location.getCurrentPositionAsync({});
        } catch (locationError) {
          console.warn('Could not get current location for sighting:', locationError);
        }
      }

      const animalName = 'Sighting';

      const newSightingData: Omit<AnimalSighting, 'id' | 'photoUrl'> & { photoUri: string; tags?: string[]; isDraft: boolean } = {
        userId: '', // will be filled from auth in service
        animalName,
        description,
        tags: selectedTags,
        photoUri: photo.uri,
        timestamp: new Date().toISOString(),
        isDraft,
        ...(trailId && { trailId: String(trailId) }),
        ...(rideId && { rideId: String(rideId) }),
        ...(currentLocation && { location: { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude } }),
      } as any;

      await AnimalSightingService.createSighting(newSightingData);
      Alert.alert(isDraft ? 'Draft Saved!' : 'Sighting Saved!', isDraft ? 'Your sighting has been saved as a draft.' : 'Your animal sighting has been recorded.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving sighting:', error);
      Alert.alert('Error', 'Could not save the sighting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Discard', 'Are you sure you want to discard this new sighting?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>New Sighting</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Add Your Photo</ThemedText>
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoButton}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color="#999" />
                <ThemedText style={styles.photoPlaceholderText}>Tap to Add Photo</ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sighting Description</ThemedText>
          <TextInput
            placeholder="Describe your sighting here: animal behavior, location details, time, etc."
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={140}
            style={styles.textArea}
            placeholderTextColor="#999"
          />
          <ThemedText style={styles.charCount}>{description.length}/140</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Tags</ThemedText>
          <View style={styles.tagsContainer}>
            {quickTags.map((tag) => (
              <TouchableOpacity
                key={tag.name}
                style={[styles.tag, { backgroundColor: tag.color }, selectedTags.includes(tag.name) && styles.tagSelected]}
                onPress={() => handleToggleTag(tag.name)}
              >
                <ThemedText style={{ color: tag.textColor, fontWeight: selectedTags.includes(tag.name) ? 'bold' : 'normal' }}>{tag.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => handleSubmit(false)} disabled={isSubmitting}>
          <ThemedText style={styles.buttonText}>Save Sighting</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.draftButton]} onPress={() => handleSubmit(true)} disabled={isSubmitting}>
          <ThemedText style={styles.buttonTextDraft}>Save for Later (Draft)</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={isSubmitting}>
          <ThemedText style={styles.buttonText}>Delete Sighting</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  photoButton: { alignItems: 'center', justifyContent: 'center', height: 150, width: '100%', backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { color: '#999', marginTop: 8 },
  textArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 16, height: 120, textAlignVertical: 'top', fontSize: 16 },
  charCount: { textAlign: 'right', marginTop: 4, color: '#999', fontSize: 12 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  tagSelected: { borderColor: '#333', transform: [{ scale: 1.05 }] },
  button: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  saveButton: { backgroundColor: '#4A90E2' },
  draftButton: { backgroundColor: '#E9E9F0', borderWidth: 1, borderColor: '#D0D0D0' },
  deleteButton: { backgroundColor: '#D9534F' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDraft: { color: '#333', fontSize: 16, fontWeight: 'bold' },
});
