import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
// You might need to install this or use a similar icon library
import { Ionicons } from '@expo/vector-icons'; 

type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  onToggleVisibility?: () => void;
  isPasswordVisible?: boolean;
};

const AuthInput = ({ label, value, onChangeText, placeholder, secureTextEntry, onToggleVisibility, isPasswordVisible }: AuthInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={COLORS.placeholder}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={onToggleVisibility} style={styles.icon}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.placeholder} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    color: COLORS.darkGray,
    marginBottom: 5,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  icon: {
    padding: 10,
  }
});

export default AuthInput;
