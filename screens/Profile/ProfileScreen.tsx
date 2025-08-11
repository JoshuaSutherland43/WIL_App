import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from '@/navigation/ProfileStack';  // adjust path

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;
const achievementsData = [
  { color: "#FFB0B0", title: "First Ride", desc: "Completed your first ride" },
  { color: "#E8FFA2", title: "100km Club", desc: "Rode over 100 km" },
  { color: "#A0FF9D", title: "Early Bird", desc: "Morning ride before 6 am" },
];

const statsData = [
  {
    label: "Rides",
    value: "12",
    boxColor: "#FFE2E5",
    circleColor: "#FA5A7D",
    icon: "activity",
  },
  {
    label: "Km",
    value: "98",
    boxColor: "#FFF4DE",
    circleColor: "#FF947A",
    icon: "map",
  },
  {
    label: "Hours",
    value: "5",
    boxColor: "#DCFCE7",
    circleColor: "green",
    icon: "clock",
  },
  {
    label: "Points",
    value: "250",
    boxColor: "#F3E8FF",
    circleColor: "#BF83FF",
    icon: "star",
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [navDisabled, setNavDisabled] = useState(false);

  const handleNavigate = useCallback(
    (screenName: string) => {
      if (navDisabled) return;
      setNavDisabled(true);
      navigation.navigate(screenName as never);
      setTimeout(() => setNavDisabled(false), 500);
    },
    [navDisabled, navigation]
  );

  type Achievement = {
    color: string;
    title: string;
    desc: string;
  };

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementCard, { backgroundColor: item.color }]}>
      <View style={styles.achievementIconOuter}>
        <Icon name="award" size={24} />
      </View>
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDesc}>{item.desc}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.container}
      keyboardShouldPersistTaps="handled" 
      nestedScrollEnabled>

      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity activeOpacity={0.7}>
          <Icon name="settings" size={27} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Icon name="bell" size={27} />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.userIcon} />
        <View style={styles.userText}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@email.com</Text>
        </View>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Stats</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PersonalStats')}>

            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {statsData.map((item, idx) => (
            <View
              key={idx}
              style={[styles.statBox, { backgroundColor: item.boxColor }]}
            >
              <Text style={styles.statLabel1}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              <View
                style={[styles.iconCircle, { backgroundColor: item.circleColor }]}
              >
                <Icon name={item.icon} size={16} color="#fff" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements Heading + View More */}
      <View style={styles.achievementsHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="award" size={20} style={{ marginRight: 5 }} />
          <Text style={styles.achievementsTitle}>Achievements</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleNavigate("AchievementsScreen")}
          disabled={navDisabled}
        >
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements Horizontal List */}
      <FlatList
        data={achievementsData}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAchievement}
        nestedScrollEnabled
      />

      {/* History Section */}
      <View style={styles.historyContainer}>
        <View>
          <Text style={styles.historyTitle}>History</Text>
          <Text style={styles.historySubtitle}>View your latest rides</Text>
        </View>
        <View style={styles.historyIconCircle}>
          <Icon name="clock" size={24} color="#fff" />
        </View>
      </View>
    </ScrollView>
  );
}

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
    padding: 16,
    paddingTop: 35,
  },

  topIcons: {
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-between",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  userIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#ccc",
  },

  userText: {
    marginLeft: 12,
  },

  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
  },

  viewMoreText: {
    fontSize: 12,
    color: "#007AFF",
  },

  statsContainer: {
    width: "100%",
    maxWidth: 375,
    height: 147,
    marginTop: 35,
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    padding: 10,
    alignSelf: "center",
  },

  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginHorizontal: 8,
    marginBottom: 8,
  },

  statsTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  statBox: {
    width: (screenWidth - 110) / 4,
    height: 90,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
    marginBottom: 15,
  },

  statLabel1: {
    fontSize: 12,
  },

  statValue: {
    fontSize: 14,
    fontWeight: "bold",
  },

  achievementsHeader: {
    marginTop: 38,
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  achievementsTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  achievementCard: {
    width: 168,
    height: 217,
    borderRadius: 25,
    marginRight: 12,
    padding: 10,
    alignItems: "center",
  },

  achievementIconOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    paddingTop: 10,
  },

  achievementDesc: {
    fontSize: 12,
    color: "#4A4949",
    textAlign: "center",
    paddingTop: 5,
  },

  historyContainer: {
    width: "100%",
    maxWidth: 375,
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 5,
    paddingLeft: 15,
    marginTop: 40,
    alignSelf: "center",
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  historySubtitle: {
    fontSize: 14,
    color: "#666",
  },

  historyIconCircle: {
    width: 53,
    height: 53,
    borderRadius: 26.5,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center",
  },
});
