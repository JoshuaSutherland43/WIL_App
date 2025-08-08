import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
// You might need to install this or use a similar icon library
import { Ionicons } from '@expo/vector-icons'; 

type SocialButtonProps = {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
};

const SocialButton = ({ title, iconName, onPress }: SocialButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={COLORS.darkGray} style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
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
    borderColor: COLORS.socialButtonBorder,
    backgroundColor: COLORS.white,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialButton;
