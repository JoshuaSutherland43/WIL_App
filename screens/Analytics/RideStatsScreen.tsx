import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const RideStatsScreen = () => {
  const [timeFilter, setTimeFilter] = useState('Weekly');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeFilters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  // Sample data for the line chart
  const chartData = {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [
      {
        data: [20, 25, 22, 28, 32, 35, 38],
        color: (opacity = 1) => `rgba(129, 199, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Weekly bar chart data
  const weeklyData = [
    { week: 'W1', value: 28 },
    { week: 'W2', value: 45 },
    { week: 'W3', value: 32 },
    { week: 'W4', value: 38 },
    { week: 'W5', value: 42 },
    { week: 'W6', value: 25 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Distance Ridden</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={120}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(129, 199, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(134, 134, 134, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#81C784',
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
        />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statLabel}>HORSES USED</Text>
          <Text style={styles.statValue}>12</Text>
          <MaterialCommunityIcons name="horse" size={24} color="#81C784" />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statLabel}>RIDES</Text>
          <Text style={styles.statValue}>26</Text>
          <MaterialCommunityIcons name="horse-variant" size={24} color="#81C784" />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statLabel}>DISTANCE</Text>
          <Text style={styles.statValue}>56 km</Text>
          <Ionicons name="location" size={24} color="#81C784" />
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>RIDE</Text>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statValue}>40:15</Text>
          <Ionicons name="timer-outline" size={24} color="#81C784" />
        </View>
      </View>

      {/* Goal Completion */}
      <View style={styles.goalCard}>
        <Text style={styles.infoTitle}>Goal Completion</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>80 km out of 100 km</Text>
        </View>
      </View>

      {/* Top Performing Horse */}
      <View style={styles.topHorseCard}>
        <Text style={styles.infoTitle}>Top Performing Horse</Text>
        <View style={styles.topHorseContent}>
          <MaterialCommunityIcons name="horse" size={48} color="#81C784" />
          <View style={styles.topHorseInfo}>
            <Text style={styles.horseName}>Josh</Text>
            <Text style={styles.horseDistance}>15.8 km</Text>
          </View>
        </View>
      </View>

      {/* Weekly Overview */}
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>Weekly Overview</Text>
        <View style={styles.barChart}>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.bar, { height: item.value * 2 }]} />
              <Text style={styles.barLabel}>{item.week}</Text>
            </View>
          ))}
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
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  filterText: {
    marginRight: 5,
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownText: {
    fontSize: 16,
  },
  chartSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    marginLeft: -20,
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
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressFill: {
    width: '80%',
    height: '100%',
    backgroundColor: '#81C784',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  topHorseCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
  },
  topHorseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  topHorseInfo: {
    marginLeft: 20,
  },
  horseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  horseDistance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  weeklySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 15,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default RideStatsScreen;