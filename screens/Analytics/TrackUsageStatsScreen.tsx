import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const TrackUsageStatsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const topRiders = [
    { name: 'Josh', distance: '14km', avatar: null, rides: 12 },
    { name: 'Caleb', distance: '8km', avatar: null, rides: 8 },
    { name: 'Kyle', distance: '5km', avatar: null, rides: 5 },
    { name: 'Sarah', distance: '4km', avatar: null, rides: 4 },
    { name: 'Mike', distance: '3km', avatar: null, rides: 3 },
  ];

  const horseUsage = [
    { name: 'Thunder', uses: 15, totalDistance: '45km', avgSpeed: '12km/h' },
    { name: 'Lightning', uses: 12, totalDistance: '38km', avgSpeed: '11km/h' },
    { name: 'Storm', uses: 10, totalDistance: '32km', avgSpeed: '10km/h' },
    { name: 'Blaze', uses: 8, totalDistance: '25km', avgSpeed: '13km/h' },
  ];

  const trailData = [
    { name: 'Forest Trail', popularity: 85, distance: '5.2km', difficulty: 'Medium' },
    { name: 'Lake Loop', popularity: 72, distance: '3.8km', difficulty: 'Easy' },
    { name: 'Mountain Path', popularity: 65, distance: '7.5km', difficulty: 'Hard' },
    { name: 'Valley Route', popularity: 58, distance: '4.3km', difficulty: 'Medium' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track & Usage Stats</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['Weekly', 'Monthly', 'Yearly'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top Riders Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TOP RIDERS</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {topRiders.map((rider, index) => {
          return (
            <React.Fragment key={`rider-${index}`}>
              <View style={styles.riderRow}>
                <Text style={styles.rank}>{index + 1}</Text>
                <View style={styles.avatar}>
                  {rider.avatar ? (
                    <Image source={{ uri: rider.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person-circle" size={40} color="#e0e0e0" />
                  )}
                </View>
                <View style={styles.riderInfo}>
                  <Text style={styles.riderName}>{rider.name}</Text>
                  <Text style={styles.riderStats}>{rider.rides} rides</Text>
                </View>
                <Text style={styles.riderDistance}>{rider.distance}</Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* Horse Usage Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HORSE USAGE STATISTICS</Text>
        <View style={styles.horseGrid}>
          {horseUsage.map((horse, index) => {
            return (
              <React.Fragment key={`horse-${index}`}>
                <View style={styles.horseCard}>
                  <MaterialCommunityIcons name="horse" size={32} color="#81C784" />
                  <Text style={styles.horseName}>{horse.name}</Text>
                  <View style={styles.horseStats}>
                    <Text style={styles.horseStatLabel}>Uses</Text>
                    <Text style={styles.horseStatValue}>{horse.uses}</Text>
                  </View>
                  <View style={styles.horseStats}>
                    <Text style={styles.horseStatLabel}>Distance</Text>
                    <Text style={styles.horseStatValue}>{horse.totalDistance}</Text>
                  </View>
                  <View style={styles.horseStats}>
                    <Text style={styles.horseStatLabel}>Avg Speed</Text>
                    <Text style={styles.horseStatValue}>{horse.avgSpeed}</Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Trail Popularity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TRAIL POPULARITY</Text>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.trailPath1} />
            <View style={styles.trailPath2} />
            <View style={styles.trailPath3} />
            <View style={styles.mapPoint1}>
              <View style={styles.mapPointInner} />
            </View>
            <View style={styles.mapPoint2}>
              <View style={styles.mapPointInner} />
            </View>
          </View>
        </View>
        {trailData.map((trail, index) => {
          return (
            <React.Fragment key={`trail-${index}`}>
              <View style={styles.trailItem}>
                <View style={styles.trailLeft}>
                  <Text style={styles.trailName}>{trail.name}</Text>
                  <View style={styles.trailDetails}>
                    <Text style={styles.trailDistance}>{trail.distance}</Text>
                    <Text style={styles.trailDifficulty}>{trail.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.trailRight}>
                  <View style={styles.popularityBar}>
                    <View
                      style={[
                        styles.popularityFill,
                        { width: `${trail.popularity}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.popularityText}>{trail.popularity}%</Text>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* Usage Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>USAGE SUMMARY</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Ionicons name="people" size={24} color="#81C784" />
            <Text style={styles.summaryValue}>45</Text>
            <Text style={styles.summaryLabel}>Active Riders</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="horse" size={24} color="#81C784" />
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Horses Used</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="trail-sign" size={24} color="#81C784" />
            <Text style={styles.summaryValue}>8</Text>
            <Text style={styles.summaryLabel}>Trails Active</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  periodButton: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  periodButtonActive: {
    backgroundColor: '#81C784',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#81C784',
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    width: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  riderStats: {
    fontSize: 12,
    color: '#999',
  },
  riderDistance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#81C784',
  },
  horseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  horseCard: {
    width: (screenWidth - 50) / 2,
    backgroundColor: '#F8F8F8',
    padding: 15,
    margin: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  horseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  horseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 2,
  },
  horseStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  horseStatValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  mapContainer: {
    marginVertical: 15,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  trailPath1: {
    position: 'absolute',
    width: 150,
    height: 3,
    backgroundColor: '#81C784',
    top: 50,
    left: 30,
    transform: [{ rotate: '25deg' }],
  },
  trailPath2: {
    position: 'absolute',
    width: 120,
    height: 3,
    backgroundColor: '#66BB6A',
    top: 100,
    right: 40,
    transform: [{ rotate: '-15deg' }],
  },
  trailPath3: {
    position: 'absolute',
    width: 100,
    height: 3,
    backgroundColor: '#4CAF50',
    bottom: 60,
    left: 60,
    transform: [{ rotate: '45deg' }],
  },
  mapPoint1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    top: 80,
    left: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPoint2: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    bottom: 50,
    right: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPointInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  trailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trailLeft: {
    flex: 1,
  },
  trailName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trailDetails: {
    flexDirection: 'row',
    gap: 10,
  },
  trailDistance: {
    fontSize: 12,
    color: '#666',
  },
  trailDifficulty: {
    fontSize: 12,
    color: '#81C784',
    fontWeight: '600',
  },
  trailRight: {
    alignItems: 'flex-end',
  },
  popularityBar: {
    width: 100,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 4,
  },
  popularityFill: {
    height: '100%',
    backgroundColor: '#81C784',
    borderRadius: 3,
  },
  popularityText: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E0E0E0',
  },
});

export default TrackUsageStatsScreen;