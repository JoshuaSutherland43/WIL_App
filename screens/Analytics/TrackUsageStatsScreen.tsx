import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import MapView, { Marker, Polyline, Heatmap } from 'react-native-maps';
import { analyticsService } from '../../services/firebase';

const { width: screenWidth } = Dimensions.get('window');

interface TopRider {
  userId: string;
  userName: string;
  totalDistance: number;
  totalRides: number;
  avatar: string | null;
}

interface HorseUsage {
  horseId: string;
  horseName: string;
  totalDistance: number;
  totalRides: number;
  totalDuration: number;
}

interface TrailData {
  id: string;
  name: string;
  distance: number;
  difficulty: string;
  popularity: number;
  coordinates: any[];
  rideCount: number;
}

const TrackUsageStatsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topRiders, setTopRiders] = useState<TopRider[]>([]);
  const [horseUsage, setHorseUsage] = useState<HorseUsage[]>([]);
  const [trailData, setTrailData] = useState<TrailData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'riders' | 'horses' | 'trails'>('riders');
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    fetchUsageData();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedPeriod]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [rideStats, horses, trails] = await Promise.all([
        analyticsService.getRideStats('', selectedPeriod), // '' or provide userId if needed
        analyticsService.getHorseUsageStats(selectedPeriod),
        analyticsService.getTrailPopularity(),
      ]);

      // Process rideStats to get top riders
      const riderMap: { [userId: string]: TopRider } = {};
      rideStats.forEach((ride: any) => {
        const { userId, userName, distance, avatar } = ride;
        if (!riderMap[userId]) {
          riderMap[userId] = {
            userId,
            userName,
            totalDistance: 0,
            totalRides: 0,
            avatar: avatar || null,
          };
        }
        riderMap[userId].totalDistance += distance || 0;
        riderMap[userId].totalRides += 1;
      });
      const riders: TopRider[] = Object.values(riderMap)
        .sort((a, b) => b.totalDistance - a.totalDistance)
        .slice(0, 10);

      setTopRiders(riders);
      setHorseUsage(horses);
      setTrailData(trails);
      
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsageData();
  };

  const renderPieChart = () => {
    const data = horseUsage.slice(0, 5).map((horse, index) => ({
      name: horse.horseName,
      uses: horse.totalRides,
      color: ['#4CAF50', '#81C784', '#66BB6A', '#A5D6A7', '#C8E6C9'][index],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

    return (
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="uses"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderBarChart = () => {
    const data = {
      labels: horseUsage.slice(0, 6).map(h => h.horseName.substring(0, 3)),
      datasets: [
        {
          data: horseUsage.slice(0, 6).map(h => h.totalDistance),
        },
      ],
    };

    return (
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={200}
        yAxisLabel=""
        yAxisSuffix=" km"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.8,
        }}
        style={styles.barChart}
        fromZero
        showBarTops
      />
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Usage Statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4CAF50']}
        />
      }
    >
      <Animated.View 
        style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
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
          {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
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
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'riders' && styles.activeTab]}
            onPress={() => setSelectedTab('riders')}
          >
            <Ionicons 
              name="people" 
              size={20} 
              color={selectedTab === 'riders' ? '#4CAF50' : '#999'} 
            />
            <Text style={[styles.tabText, selectedTab === 'riders' && styles.activeTabText]}>
              Riders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'horses' && styles.activeTab]}
            onPress={() => setSelectedTab('horses')}
          >
            <MaterialCommunityIcons 
              name="horse" 
              size={20} 
              color={selectedTab === 'horses' ? '#4CAF50' : '#999'} 
            />
            <Text style={[styles.tabText, selectedTab === 'horses' && styles.activeTabText]}>
              Horses
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'trails' && styles.activeTab]}
            onPress={() => setSelectedTab('trails')}
          >
            <Ionicons 
              name="trail-sign" 
              size={20} 
              color={selectedTab === 'trails' ? '#4CAF50' : '#999'} 
            />
            <Text style={[styles.tabText, selectedTab === 'trails' && styles.activeTabText]}>
              Trails
            </Text>
          </TouchableOpacity>
        </View>

        {/* Top Riders Section */}
        {selectedTab === 'riders' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>TOP RIDERS</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {topRiders.map((rider, index) => {
                return (
                  <React.Fragment key={`rider-${rider.userId}`}>
                    <TouchableOpacity style={styles.riderRow} activeOpacity={0.7}>
                      <View style={styles.rankContainer}>
                        <Text style={styles.rank}>{index + 1}</Text>
                        {index < 3 && (
                          <Ionicons 
                            name="trophy" 
                            size={16} 
                            color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
                          />
                        )}
                      </View>
                      <View style={styles.avatar}>
                        {rider.avatar ? (
                          <Image source={{ uri: rider.avatar }} style={styles.avatarImage} />
                        ) : (
                          <Ionicons name="person-circle" size={40} color="#e0e0e0" />
                        )}
                      </View>
                      <View style={styles.riderInfo}>
                        <Text style={styles.riderName}>{rider.userName}</Text>
                        <Text style={styles.riderStats}>{rider.totalRides} rides</Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Text style={styles.riderDistance}>{rider.totalDistance.toFixed(1)}km</Text>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${Math.min((rider.totalDistance / topRiders[0]?.totalDistance) * 100, 100)}%` }
                            ]} 
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Horse Usage Statistics */}
        {selectedTab === 'horses' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>HORSE USAGE STATISTICS</Text>
              
              {/* Pie Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Usage Distribution</Text>
                {horseUsage.length > 0 && renderPieChart()}
              </View>
              
              {/* Bar Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Distance Covered</Text>
                {horseUsage.length > 0 && renderBarChart()}
              </View>
              
              {/* Horse Cards Grid */}
              <View style={styles.horseGrid}>
                {horseUsage.slice(0, 4).map((horse, index) => {
                  return (
                    <React.Fragment key={`horse-${horse.horseId}`}>
                      <TouchableOpacity style={styles.horseCard} activeOpacity={0.8}>
                        <View style={styles.horseIconContainer}>
                          <MaterialCommunityIcons name="horse" size={32} color="#fff" />
                        </View>
                        <Text style={styles.horseName}>{horse.horseName}</Text>
                        <View style={styles.horseStats}>
                          <Text style={styles.horseStatLabel}>Uses</Text>
                          <Text style={styles.horseStatValue}>{horse.totalRides}</Text>
                        </View>
                        <View style={styles.horseStats}>
                          <Text style={styles.horseStatLabel}>Distance</Text>
                          <Text style={styles.horseStatValue}>{horse.totalDistance.toFixed(1)}km</Text>
                        </View>
                        <View style={styles.horseStats}>
                          <Text style={styles.horseStatLabel}>Duration</Text>
                          <Text style={styles.horseStatValue}>{Math.round(horse.totalDuration)}min</Text>
                        </View>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Trail Popularity */}
        {selectedTab === 'trails' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TRAIL POPULARITY</Text>
              
              {/* Map View */}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {trailData.map((trail) => (
                    <Marker
                      key={trail.id}
                      coordinate={{
                        latitude: trail.coordinates?.[0]?.latitude || 37.78825,
                        longitude: trail.coordinates?.[0]?.longitude || -122.4324,
                      }}
                      title={trail.name}
                      description={`Popularity: ${trail.popularity}%`}
                    >
                      <View style={styles.markerContainer}>
                        <Text style={styles.markerText}>{trail.popularity}%</Text>
                      </View>
                    </Marker>
                  ))}
                </MapView>
              </View>
              
              {/* Trail List */}
              {trailData.map((trail, index) => {
                return (
                  <React.Fragment key={`trail-${trail.id}`}>
                    <TouchableOpacity style={styles.trailItem} activeOpacity={0.7}>
                      <View style={styles.trailLeft}>
                        <Text style={styles.trailName}>{trail.name}</Text>
                        <View style={styles.trailDetails}>
                          <View style={styles.trailBadge}>
                            <Ionicons name="navigate" size={12} color="#666" />
                            <Text style={styles.trailDistance}>{trail.distance}km</Text>
                          </View>
                          <View style={[styles.trailBadge, styles.difficultyBadge]}>
                            <Text style={styles.trailDifficulty}>{trail.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.trailRight}>
                        <Text style={styles.rideCount}>{trail.rideCount} rides</Text>
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
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Usage Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>USAGE SUMMARY</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="people" size={24} color="#fff" />
              </View>
              <Text style={styles.summaryValue}>{topRiders.length}</Text>
              <Text style={styles.summaryLabel}>Active Riders</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <MaterialCommunityIcons name="horse" size={24} color="#fff" />
              </View>
              <Text style={styles.summaryValue}>{horseUsage.length}</Text>
              <Text style={styles.summaryLabel}>Horses Used</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="trail-sign" size={24} color="#fff" />
              </View>
              <Text style={styles.summaryValue}>{trailData.length}</Text>
              <Text style={styles.summaryLabel}>Trails Active</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
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
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    letterSpacing: 0.5,
  },
  viewAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankContainer: {
    width: 35,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22.5,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  riderStats: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  riderDistance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  chartContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  barChart: {
    borderRadius: 16,
  },
  horseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginTop: 15,
  },
  horseCard: {
    width: (screenWidth - 70) / 2,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 15,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  horseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  horseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  horseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 3,
  },
  horseStatLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  horseStatValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  mapContainer: {
    height: 250,
    marginVertical: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trailLeft: {
    flex: 1,
  },
  trailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  trailDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  trailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadge: {
    backgroundColor: '#E8F5E9',
  },
  trailDistance: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  trailDifficulty: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  trailRight: {
    alignItems: 'flex-end',
  },
  rideCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
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
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  popularityText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
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
  summaryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
});
export default TrackUsageStatsScreen;