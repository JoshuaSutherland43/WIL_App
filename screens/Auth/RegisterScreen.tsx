import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthHeader from '../../components/Auth/AuthHeader';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import SocialButton from '../../components/Auth/SocialButton';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AuthHeader activeTab="SignUp" onTabPress={() => navigation.navigate('Login')} />
        
        <AuthInput
          label="Your Email"
          value={email}
          onChangeText={setEmail}
          placeholder="contacthelp@gmail.com"
        />
        
        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••"
          secureTextEntry
          isPasswordVisible={isPasswordVisible}
          onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        <View style={styles.forgotPasswordContainer}>
            <Text style={styles.errorText}>Wrong password</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>
        </View>

        <AuthButton title="Continue" onPress={() => { /* Handle Register */ }} isPrimary={false} />

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <SocialButton title="Login with Apple" iconName="logo-apple" onPress={() => { /* Handle Apple Login */ }} />
        <SocialButton title="Login with Google" iconName="logo-google" onPress={() => { /* Handle Google Login */ }} />

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    padding: 20,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
  },
  link: {
    color: COLORS.link,
    fontSize: 14,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  orText: {
    marginHorizontal: 10,
    color: COLORS.darkGray,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomText: {
    color: COLORS.darkGray,
  },
});

export default RegisterScreen;
