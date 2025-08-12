import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.topIcons}>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="settings" size={27} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="bell" size={27} />
          </TouchableOpacity>
        </View>

        {/* Emergency Alert */}
        <View style={styles.emergencyAlert}>
          <View style={styles.alertLeft}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertText}>John Needs Help!</Text>
          </View>
          <View style={styles.alertButtons}>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.buttonText}>Track</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.buttonText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <View style={styles.mapView}>
            <View style={styles.mapGradient}>
              <Text style={styles.mapDistance}>2.5 km</Text>
            </View>
          </View>
          
          <View style={styles.mapButtons}>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Hike</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapInfo}>
            <Text style={styles.infoText}>📍 Distance: 2.5 km</Text>
            <Text style={styles.infoText}>⏱ Duration: 34 min</Text>
          </View>
        </View>

        {/* User Profiles */}
        <View style={styles.profilesContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.profileName}>Rose Smith</Text>
            <Text style={styles.profileEmail}>rose.smith@gmail.com</Text>
            <View style={styles.profileStats}>
              <Text style={styles.statText}>Rides: 23</Text>
              <Text style={styles.statText}>Distance: 167 km</Text>
            </View>
            <View style={styles.obstacleReport}>
              <Text style={styles.obstacleTitle}>⚠️ Report Obstacle</Text>
              <Text style={styles.obstacleDesc}>Tree blocking trail</Text>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.profileName}>Rose Smith</Text>
            <Text style={styles.profileEmail}>rose.smith@gmail.com</Text>
            <View style={styles.profileStats}>
              <Text style={styles.statText}>Rides: 23</Text>
              <Text style={styles.statText}>Distance: 167 km</Text>
            </View>
            <View style={styles.obstacleReport}>
              <Text style={styles.obstacleTitle}>⚠️ Report Obstacle</Text>
              <Text style={styles.obstacleDesc}>Tree blocking trail</Text>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trail Usage Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Trail Usage</Text>
            <Text style={styles.chartTrend}>📈 6%</Text>
          </View>
          
          <View style={styles.chartBars}>
            {[30, 45, 80, 60, 40, 65, 35].map((height, index) => (
              <View key={index} style={[styles.chartBar, { height: height * 0.8 }]} />
            ))}
          </View>
          
          <View style={styles.chartLabels}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((label, index) => (
              <Text key={index} style={styles.chartLabel}>{label}</Text>
            ))}
          </View>
          
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>

        {/* Community Goal */}
        <View style={styles.communityGoal}>
          <View style={styles.goalLeft}>
            <Text style={styles.goalTitle}>Community Goal</Text>
            <Text style={styles.goalProgress}>2071/10000</Text>
          </View>
          <View style={styles.goalRight}>
            <Text style={styles.goalNumber}>30</Text>
            <Text style={styles.goalLabel}>Riders</Text>
          </View>
        </View>

        {/* Bottom spacing for scroll */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🗺️</Text>
          <Text style={styles.navText}>Mapping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCenter}>
          <View style={styles.navPlusButton}>
            <Text style={styles.navPlusText}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  topIcons: {
    flexDirection: 'row',
    paddingTop: 45,

    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emergencyAlert: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  alertText: {
    color: 'white',
    fontWeight: '500',
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  callButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  buttonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
  },
  mapContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  mapView: {
    height: 120,
    marginBottom: 16,
  },
  mapGradient: {
    height: '100%',
    backgroundColor: '#a7f3d0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  mapDistance: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
  },
  mapButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mapInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoText: {
    fontSize: 10,
    color: '#6b7280',
  },
  profilesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  profileCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    color: 'white',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  statText: {
    fontSize: 10,
    color: '#6b7280',
  },
  obstacleReport: {
    alignItems: 'center',
    marginTop: 8,
  },
  obstacleTitle: {
    fontSize: 10,
    color: '#f97316',
    marginBottom: 4,
  },
  obstacleDesc: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  submitText: {
    fontSize: 10,
    color: '#374151',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartTrend: {
    fontSize: 10,
    color: '#16a34a',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    marginBottom: 8,
    gap: 2,
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  detailsButton: {
    alignItems: 'center',
  },
  detailsText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  communityGoal: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLeft: {},
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 10,
    color: '#6b7280',
  },
  goalRight: {
    alignItems: 'flex-end',
  },
  goalNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  goalLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#9ca3af',
  },
  navIconActive: {
    fontSize: 20,
    marginBottom: 4,
    color: '#3b82f6',
  },
  navText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  navTextActive: {
    fontSize: 10,
    color: '#3b82f6',
  },
  navPlusButton: {
    backgroundColor: '#ef4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navPlusText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;