import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'react-native';

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  isPrimary: boolean;
};

const AuthButton = ({ title, onPress, isPrimary }: AuthButtonProps) => {
  const scheme = useColorScheme();
  const palette = Colors[(scheme as 'light' | 'dark') || 'light'] || Colors.light;
  const buttonColor = isPrimary ? palette.primary : palette.primary_signup;
  const textColor = '#FFFFFF';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthButton;
