import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

const VerifyEmailScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.inner}>
				<Text style={styles.title}>Verify your email</Text>
				<Text style={styles.body}>
					We sent a verification link to your email. Please check your inbox and come back once verified.
				</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: COLORS.white },
	inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: COLORS.darkGray },
	body: { fontSize: 16, textAlign: 'center', color: COLORS.darkGray },
});

export default VerifyEmailScreen;
