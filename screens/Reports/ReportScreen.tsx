import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { ReportsService } from '../../services/ReportsService';

export default function ReportScreen() {
  const navigation = useNavigation<any>();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permissions are needed to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library permissions are needed to select photos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const submit = async () => {
    if (!description.trim() && photos.length === 0) {
      Alert.alert('Empty report', 'Add a description or at least one photo.');
      return;
    }
    setSubmitting(true);
    try {
      let loc: Location.LocationObject | null = null;
      try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (perm.status === 'granted') {
          loc = await Location.getCurrentPositionAsync({});
        }
      } catch {}

      await ReportsService.createReport({
        title: title?.trim() || undefined,
        description,
        photos,
        location: loc ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude } : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Report submitted.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Title (optional)</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Enter a title" style={styles.input} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue or observation"
            multiline
            numberOfLines={5}
            style={[styles.input, styles.textArea]}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.photoBtnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtnLight} onPress={pickPhoto}>
              <Ionicons name="image" size={20} color="#2D2D2D" />
              <Text style={styles.photoBtnTextDark}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photoGrid}>
            {photos.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.photo} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submit} onPress={submit} disabled={submitting}>
          <Text style={styles.submitText}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  field: { marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9F9F9' },
  textArea: { height: 120, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  photoBtn: { backgroundColor: '#2D2D2D', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  photoBtnLight: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  photoBtnText: { color: '#fff', fontWeight: '600' },
  photoBtnTextDark: { color: '#2D2D2D', fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  photo: { width: 90, height: 90, borderRadius: 8 },
  submit: { backgroundColor: '#4A90E2', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
