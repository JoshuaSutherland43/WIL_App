import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase'; // Adjust path as needed

const { width: screenWidth } = Dimensions.get('window');

interface RideData {
  id: string;
  userId: string;
  horseId: string;
  horseName: string;
  distance: number;
  duration: number;
  date: Timestamp;
  route: any[];
}

interface StatsData {
  totalHorses: number;
  totalRides: number;
  totalDistance: number;
  totalDuration: number;
  weeklyData: number[];
  monthlyProgress: number;
  topHorse: {
    name: string;
    distance: number;
  };
}

const RideStatsScreen = () => {
  const [timeFilter, setTimeFilter] = useState('Weekly');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState<StatsData>({
    totalHorses: 0,
    totalRides: 0,
    totalDistance: 0,
    totalDuration: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    monthlyProgress: 0,
    topHorse: { name: 'N/A', distance: 0 },
  });
  const [chartData, setChartData] = useState<any>(null);
  const fadeAnim = new Animated.Value(0);

  const timeFilters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  useEffect(() => {
    fetchAnalyticsData();
    const unsubscribe = subscribeToRealTimeUpdates();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => unsubscribe();
  }, [timeFilter]);

  const subscribeToRealTimeUpdates = () => {
    const ridesRef = collection(db, 'rides');
    const q = query(ridesRef, orderBy('date', 'desc'), limit(100));
    
    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          fetchAnalyticsData();
        }
      });
    });
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Get date range based on filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeFilter) {
        case 'Daily':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'Weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'Monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'Yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch rides from Firebase
      const ridesRef = collection(db, 'rides');
      const q = query(
        ridesRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(now)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const rides: RideData[] = [];
      
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() } as RideData);
      });

      // Process analytics data
      const processedStats = processRideData(rides);
      setStatsData(processedStats);
      
      // Update chart data
      updateChartData(rides);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processRideData = (rides: RideData[]): StatsData => {
    const uniqueHorses = new Set(rides.map(r => r.horseId));
    const totalDistance = rides.reduce((sum, r) => sum + r.distance, 0);
    const totalDuration = rides.reduce((sum, r) => sum + r.duration, 0);
    
    // Calculate weekly distribution
    const weeklyData = new Array(7).fill(0);
    const today = new Date();
    
    rides.forEach(ride => {
      const rideDate = ride.date.toDate();
      const dayDiff = Math.floor((today.getTime() - rideDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff < 7) {
        weeklyData[6 - dayDiff] += ride.distance;
      }
    });

    // Find top performing horse
    const horseDistances: { [key: string]: { name: string; distance: number } } = {};
    rides.forEach(ride => {
      if (!horseDistances[ride.horseId]) {
        horseDistances[ride.horseId] = { name: ride.horseName, distance: 0 };
      }
      horseDistances[ride.horseId].distance += ride.distance;
    });
    
    const topHorse = Object.values(horseDistances).sort((a, b) => b.distance - a.distance)[0] || 
                     { name: 'N/A', distance: 0 };

    // Calculate monthly progress (assuming 100km goal)
    const monthlyGoal = 100;
    const monthlyProgress = Math.min((totalDistance / monthlyGoal) * 100, 100);

    return {
      totalHorses: uniqueHorses.size,
      totalRides: rides.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalDuration,
      weeklyData: weeklyData.map(d => Math.round(d * 10) / 10),
      monthlyProgress,
      topHorse,
    };
  };

  const updateChartData = (rides: RideData[]) => {
    const labels = timeFilter === 'Weekly' 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : timeFilter === 'Monthly'
      ? ['W1', 'W2', 'W3', 'W4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const data = processChartData(rides, timeFilter);
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(129, 199, 132, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    });
  };

  const processChartData = (rides: RideData[], filter: string) => {
    // Process rides data based on filter
    // This is a simplified version - expand based on your needs
    if (filter === 'Weekly') {
      return statsData.weeklyData;
    }
    // Add more processing for other filters
    return [20, 25, 22, 28, 32, 35, 38];
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Analytics...</Text>
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
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="horse" size={32} color="#000" />
            <View style={styles.clockIcon}>
              <Text style={styles.clockText}>S.B.K</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Title and Filter */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Community Analytics</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={styles.filterText}>{timeFilter}</Text>
              <Ionicons name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={styles.dropdown}>
                {timeFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTimeFilter(filter);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{filter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Distance Chart */}
        {chartData && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Distance Ridden</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={180}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(134, 134, 134, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#4CAF50',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#E3E3E3',
                  strokeWidth: 1,
                },
              }}
              bezier
              style={styles.chart}
              withShadow
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withDots={true}
              fromZero={true}
            />
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard} activeOpacity={0.8}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={styles.statLabel}>HORSES USED</Text>
            <Text style={styles.statValue}>{statsData.totalHorses}</Text>
            <MaterialCommunityIcons name="horse" size={24} color="#81C784" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} activeOpacity={0.8}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={styles.statLabel}>RIDES</Text>
            <Text style={styles.statValue}>{statsData.totalRides}</Text>
            <MaterialCommunityIcons name="horse-variant" size={24} color="#81C784" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} activeOpacity={0.8}>
            <Text style={styles.statLabel}>TOTAL</Text>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>{statsData.totalDistance} km</Text>
            <Ionicons name="location" size={24} color="#81C784" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard} activeOpacity={0.8}>
            <Text style={styles.statLabel}>RIDE</Text>
            <Text style={styles.statLabel}>DURATION</Text>
            <Text style={styles.statValue}>{formatDuration(statsData.totalDuration)}</Text>
            <Ionicons name="timer-outline" size={24} color="#81C784" />
          </TouchableOpacity>
        </View>

        {/* Goal Completion with Circular Progress */}
        <View style={styles.goalCard}>
          <Text style={styles.infoTitle}>Goal Completion</Text>
          <View style={styles.circularProgressContainer}>
            <ProgressChart
              data={{
                data: [statsData.monthlyProgress / 100],
              }}
              width={screenWidth - 80}
              height={180}
              strokeWidth={16}
              radius={60}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                strokeWidth: 2,
              }}
              hideLegend={true}
              style={styles.circularChart}
            />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressPercentage}>{Math.round(statsData.monthlyProgress)}%</Text>
              <Text style={styles.progressSubtext}>of monthly goal</Text>
              <Text style={styles.progressDetails}>
                {statsData.totalDistance} / 100 km
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performing Horse */}
        <View style={styles.topHorseCard}>
          <Text style={styles.infoTitle}>Top Performing Horse</Text>
          <View style={styles.topHorseContent}>
            <View style={styles.horseIconContainer}>
              <MaterialCommunityIcons name="horse" size={48} color="#fff" />
            </View>
            <View style={styles.topHorseInfo}>
              <Text style={styles.horseName}>{statsData.topHorse.name}</Text>
              <Text style={styles.horseDistance}>{statsData.topHorse.distance.toFixed(1)} km</Text>
              <View style={styles.horseBadge}>
                <Ionicons name="trophy" size={16} color="#FFD700" />
                <Text style={styles.badgeText}>Champion</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Overview Bar Chart */}
        <View style={styles.weeklySection}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <BarChart
            data={{
              labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
              datasets: [
                {
                  data: [28, 45, 32, 38, 42, 25],
                },
              ],
            }}
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
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: '#E3E3E3',
                strokeWidth: 1,
              },
            }}
            style={styles.barChart}
            showBarTops={false}
            fromZero={true}
          />
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginLeft: -10,
  },
  clockText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  filterText: {
    marginRight: 5,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    marginLeft: -20,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  statCard: {
    width: (screenWidth - 40) / 2,
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  circularProgressContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  circularChart: {
    borderRadius: 16,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
  topHorseCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  topHorseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  horseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  topHorseInfo: {
    alignItems: 'flex-start',
  },
  horseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  horseDistance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 5,
  },
  horseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  badgeText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 5,
    fontWeight: '600',
  },
  weeklySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default RideStatsScreen;