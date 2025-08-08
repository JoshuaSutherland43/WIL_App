import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 
 * 
 * 
 * 
 * UI-only Map View
 * - Dark map canvas (placeholder View)
 * - Top overlay actions (settings, notifications with dot)
 * - Floating segmented buttons: Free Ride | Recent
 */
const UserMapView: React.FC = () => {
	return (
		<View style={styles.root}>
					{/* Map canvas placeholder (replace with MapView later) */}
					<View style={styles.map}>
						<Text style={styles.mapPlaceholderText}>Map will go here in the future</Text>
					</View>

			{/* Top overlay */}
			<View style={styles.topBar}>
				<TouchableOpacity activeOpacity={0.8} style={[styles.iconBtn, styles.leftIcon]}> 
					<Ionicons name="settings-sharp" size={20} color="#fff" />
				</TouchableOpacity>

						<View style={styles.rightIcons}>
							<TouchableOpacity activeOpacity={0.8} style={styles.iconBtn}>
						<Ionicons name="notifications-outline" size={20} color="#fff" />
						<View style={styles.dot} />
					</TouchableOpacity>
				</View>
			</View>



			{/* Bottom segmented buttons */}
			<View style={styles.segmentContainer}>
				<TouchableOpacity activeOpacity={0.9} style={[styles.segment, styles.freeRide]}> 
					<Text style={styles.segmentText}>Free Ride</Text>
				</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.9} style={[styles.segment, styles.recent, { marginLeft: 12 }]}> 
					<Text style={styles.segmentText}>Recent</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#0f0f10',
	},
	map: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#121417',
			alignItems: 'center',
			justifyContent: 'center',
	},
		mapPlaceholderText: {
			color: '#9AA0A6',
			fontSize: 14,
		},
	topBar: {
		position: 'absolute',
		top: 12,
		left: 12,
		right: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	leftIcon: {
		marginRight: 8,
	},
	rightIcons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: 'rgba(0,0,0,0.45)',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(255,255,255,0.12)',
	},
	dot: {
		position: 'absolute',
		top: 6,
		right: 6,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#FF3B30',
	},
	segmentContainer: {
		position: 'absolute',
		left: 16,
		right: 16,
		bottom: 120, // keeps above custom tab bar
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	segment: {
		flex: 1,
		height: 44,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 6,
	},
	freeRide: {
		backgroundColor: '#FF7DA4',
	},
	recent: {
		backgroundColor: '#F2B270',
	},
	segmentText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
});

export default UserMapView;

