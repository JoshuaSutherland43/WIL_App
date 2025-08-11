import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors'; // Make sure this is correct import

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  isPrimary: boolean;
};

const AuthButton = ({ title, onPress, isPrimary }: AuthButtonProps) => {
  // If you want to support dark/light mode, you might get colors from a hook
  // For now, assuming Colors.light for simplicity:
  const buttonColor = isPrimary ? Colors.light.primary : Colors.light.primary_signup;
  const textColor = Colors.light.white;

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
