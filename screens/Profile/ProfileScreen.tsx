import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity>
          <Icon name="settings" size={33} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bell" size={33} />
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

      {/* View More for Stats */}
      <TouchableOpacity style={styles.viewMore}>
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Stats</Text>
        <View style={styles.statsRow}>
          {[
            { label: "Rides", value: "12", color: "#FFE2E5", icon: "activity" },
            { label: "Km", value: "98", color: "#FFF4DE", icon: "map" },
            { label: "Hours", value: "5", color: "#DCFCE7", icon: "clock" },
            { label: "Points", value: "250", color: "#F3E8FF", icon: "star" }
          ].map((item, idx) => (
            <View key={idx} style={[styles.statBox, { backgroundColor: item.color }]}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              <Icon name={item.icon} size={30} />
            </View>
          ))}
        </View>
      </View>

      {/* View More for Achievements */}
      <TouchableOpacity style={styles.viewMore}>
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>

      {/* Achievements Heading */}
      <View style={styles.achievementsHeading}>
        <Icon name="award" size={20} style={{ marginRight: 5 }} />
        <Text style={styles.achievementsTitle}>Achievements</Text>
      </View>

      {/* Achievements Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { color: "#FFB0B0", title: "First Ride", desc: "Completed your first ride" },
          { color: "#E8FFA2", title: "100km Club", desc: "Rode over 100 km" },
          { color: "#A0FF9D", title: "Early Bird", desc: "Morning ride before 6 am" }
        ].map((item, idx) => (
          <View key={idx} style={[styles.achievementCard, { backgroundColor: item.color }]}>
            <View style={styles.achievementIconOuter}>
              <Icon name="award" size={24} />
            </View>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDesc}>{item.desc}</Text>
          </View>
        ))}
      </ScrollView>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  topIcons: { flexDirection: "row", justifyContent: "space-between" },
  userSection: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  userIcon: { width: 78, height: 78, borderRadius: 39, backgroundColor: "#ccc" },
  userText: { marginLeft: 12 },
  userName: { fontSize: 20, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
  viewMore: { alignSelf: "flex-end", marginTop: 10, marginBottom: 5 },
  viewMoreText: { fontSize: 12, color: "#007AFF" },
  statsContainer: {
    width: 356,
    height: 125,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center"
  },
  statsTitle: { textAlign: "center", fontWeight: "bold", marginBottom: 8 },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statBox: {
    width: 57,
    height: 65,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4
  },
  statLabel: { fontSize: 10 },
  statValue: { fontSize: 12, fontWeight: "bold" },
  achievementsHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  achievementsTitle: { fontWeight: "bold", fontSize: 16 },
  achievementCard: {
    width: 168,
    height: 217,
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    alignItems: "center"
  },
  achievementIconOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  achievementTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  achievementDesc: { fontSize: 12, color: "#4A4949", textAlign: "center" },
  historyContainer: {
    width: 348,
    height: 68,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 20,
    alignSelf: "center"
  },
  historyTitle: { fontSize: 16, fontWeight: "bold" },
  historySubtitle: { fontSize: 14, color: "#666" },
  historyIconCircle: {
    width: 53,
    height: 53,
    borderRadius: 26.5,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center"
  }
});
