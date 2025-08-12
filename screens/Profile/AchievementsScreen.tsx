// AchievementsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather'; // You can swap for medal/badge icons you prefer
import { FontAwesome5 } from '@expo/vector-icons';
import {Colors} from '@/constants/colors';
const { width } = Dimensions.get('window');

type Achievement = {
  id: string;
  title: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold';
  unlocked: boolean;
  current: number;
  total: number;
  icon: string;
};

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Ride',
    description: 'Complete your first ride',
    type: 'bronze',
    unlocked: true,
    current: 1,
    total: 3,
    icon: 'bicycle',
  },
  {
    id: '2',
    title: 'Trail Explorer',
    description: 'Explore 5 unique trails',
    type: 'silver',
    unlocked: false,
    current: 2,
    total: 5,
    icon: 'map-marked-alt',
  },
  {
    id: '3',
    title: 'Marathon Rider',
    description: 'Ride 100 km in total',
    type: 'gold',
    unlocked: true,
    current: 85,
    total: 100,
    icon: 'trophy',
  },
  {
    id: '4',
    title: 'First Ride',
    description: 'Complete your first ride',
    type: 'bronze',
    unlocked: true,
    current: 1,
    total: 3,
    icon: 'bicycle',
  },
  {
    id: '5',
    title: 'Trail Explorer',
    description: 'Explore 5 unique trails',
    type: 'silver',
    unlocked: false,
    current: 2,
    total: 5,
    icon: 'map-marked-alt',
  },
  {
    id: '6',
    title: 'Marathon Rider',
    description: 'Ride 100 km in total',
    type: 'gold',
    unlocked: true,
    current: 85,
    total: 100,
    icon: 'trophy',
  },
];

export default function AchievementsScreen() {
const renderBadgeGradient = (type: Achievement['type']): [string, string] => {
  switch (type) {
    case 'bronze':
      return ['#E0C04F', '#B16F07'];
    case 'silver':
      return ['#FFFFFF', '#B1B1B1'];
    case 'gold':
      return ['#FFE178', '#DD9F00'];
    default:
      return ['#ccc', '#999'];
  }
};

  const renderAchievementItem = ({ item }: { item: Achievement }) => {
    const badgeColors: [string, string] = item.unlocked
  ? renderBadgeGradient(item.type)
  : ['#dcdcdc', '#a9a9a9'];
    return (
      <View style={styles.achievementCard}>
        {/* Badge */}
        <LinearGradient colors={badgeColors} style={styles.badge}>
          <FontAwesome5 name={item.icon} size={24} color={item.unlocked ? '#000' : '#777'} />
        </LinearGradient>

        {/* Info */}
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementDesc}>{item.description}</Text>
          <Text style={styles.achievementProgress}>
            {item.current}/{item.total}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Text style={styles.heading}>ACHIEVEMNETS</Text>
        <Text style={styles.points}>120</Text>
        <Text style={styles.totalPoints}>Total Points</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        {/* Medals */}
        <View style={styles.medalRow}>
          <FontAwesome5 name="medal" size={24} color="#FFB0B0" />
          <FontAwesome5 name="medal" size={24} color="#E8FFA2" />
          <FontAwesome5 name="medal" size={24} color="#A0FF9D" />
        </View>
      </View>

      {/* Achievement List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={renderAchievementItem}
          scrollEnabled={false}
          contentContainerStyle={{paddingBottom: 150,}}>
        </FlatList>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    alignItems: 'center',
  },
  topContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    marginTop:10,
    fontSize: 15.3,
    fontWeight: 'bold',
  },
  points: {
    fontSize: 52,
    fontWeight: 'bold',
  },
  totalPoints: {
    fontSize: 20,
    marginBottom: 15,
  },
  progressContainer: {
    width: width - 30,
    paddingHorizontal: 15,
  },
  progressBackground: {
    width: 321,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
  },
  medalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 321,
    marginTop: 10,
  },
  listContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  achievementCard: {
    width: 386,
    height: 95,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  achievementProgress: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});
