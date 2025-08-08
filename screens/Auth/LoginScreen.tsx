import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';
import AuthHeader from '../../components/Auth/AuthHeader';
import AuthInput from '../../components/Auth/AuthInput';
import AuthButton from '../../components/Auth/AuthButton';
import SocialButton from '../../components/Auth/SocialButton';
import { loginUser } from '../../services/auth';




  //CODE THAT DOES THE AUTHENTICATION//
  //CODE THAT DOES THE AUTHENTICATION//

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

const [error, setError] = useState('');

const handleLogin = async () => {
  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }
  try {
    const userCredential = await loginUser(email.trim(), password);
    console.log('User signed in!', userCredential.user?.uid);
    setError('');
    // TODO: Navigate to the main app screen later
  } catch (err: any) {
    switch (err?.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        setError('Invalid email or password.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      case 'auth/too-many-requests':
        setError('Too many attempts. Try again later.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
        break;
    }
    console.error(err);
  }
};

//FRONTEND CODE ////FRONTEND CODE //
//FRONTEND CODE ////FRONTEND CODE //
//FRONTEND CODE ////FRONTEND CODE //
//FRONTEND CODE ////FRONTEND CODE //

return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AuthHeader activeTab="Login" onTabPress={() => navigation.navigate('Register')} />
      
      <AuthInput
        label="Your Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        placeholder="help@gmail.com"

      />
      
      <AuthInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError('');
        }}
        placeholder="••••••••••"
        secureTextEntry={!isPasswordVisible}
        isPasswordVisible={isPasswordVisible}
        onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
      />

      <View style={styles.forgotPasswordContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : <View />}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
      </View>

      <AuthButton title="Continue" onPress={handleLogin} isPrimary={true} />

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      <SocialButton title="Login with Apple" iconName="logo-apple" onPress={() => { /* Handle Apple Login */ }} />
      <SocialButton title="Login with Google" iconName="logo-google" onPress={() => { /* Handle Google Login */ }} />

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

///CODE THAT DOES THE STYLING///  ///CODE THAT DOES THE STYLING///  
///CODE THAT DOES THE STYLING///  ///CODE THAT DOES THE STYLING///  
///CODE THAT DOES THE STYLING///  ///CODE THAT DOES THE STYLING///    

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

export default LoginScreen;
