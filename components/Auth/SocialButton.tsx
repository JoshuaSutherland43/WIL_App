import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type SocialButtonProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const SocialButton = ({ title, iconName, onPress }: SocialButtonProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: colors.socialButtonBorder, backgroundColor: colors.white }]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={24} color={colors.darkGrey} style={styles.icon} />
      <Text style={[styles.buttonText, { color: colors.darkGrey }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialButton;
