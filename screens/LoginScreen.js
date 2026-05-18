import React, { useState } from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; 
import { Feather } from '@expo/vector-icons'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import { auth } from '../firebaseConfig'; // Import Firebase auth instance

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const gotoHome = () => {
    navigation.navigate('HomeTabNavigator');
  };

  const goToSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
  
    try {
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to home screen upon successful login
      gotoHome();
      // Log success message to console
      console.log('User logged in successfully!');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        // Display alert for wrong password
        Alert.alert('Login Failed', 'Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        // Display alert for non-existing account
        Alert.alert('Login Failed', 'Account does not exist. Please sign up.');
      } else {
        // Display general error message
        Alert.alert('Login Failed', error.message);
      }
    }
  };
  
  return (
    <ImageBackground
      source={{
        uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/login-mob-bg?v=1710057300780',
      }}
      style={styles.background}>
      <View style={styles.loginPage}>
        <Text style={styles.welcome}>W E L C O M E{'\n'}B A C K</Text>

        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={{
              uri: 'https://cdn.glitch.global/b9403491-4307-4eb7-a75a-d73f6b97dd83/Rescueguard%20(390%20x%20844%20px)%20(390%20x%20390%20px).png?v=1710890476484',
            }}
            alt="Brand Logo"
          />
        </View>
        <View style={styles.loginForm}>
        <View style={styles.inputGroup}>
            <Feather name="mail" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              
              placeholder="Email"
              placeholderTextColor="#000000b6"
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="lock" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#000000b6"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity onPress={goToForgotPassword}>
        <Text style={styles.forgotPwText}>
          Forgot Password?{' '}
            <Text style={styles.forgotPwLink}>Retrieve your account here.</Text>
         
        </Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#5adfe5', '#ec0d64']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientBackground, styles.buttonWidth]}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
         
         
        <TouchableOpacity onPress={goToSignUp}>
        <Text style={styles.registerText}>
          Don’t Have an Account?{' '}
            <Text style={styles.registerLink}>Register Here!</Text>
         
        </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loginPage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 20, 36, 0.8)',
    padding: 40,
  },
  welcome: {
    textAlign: 'left',
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Poppins-Semibold',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loginForm: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 9,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    padding: 18,
    color: '#000000',
    letterSpacing: 2,
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  gradientBackground: {
    borderRadius: 15,
    padding: 10,
  },
  buttonWidth: {
    width: '100%',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPwText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#d8caca',
    marginBottom: 10,
  },
  forgotPwLink: {
    color: '#5CE1E6',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#d8caca',
  },
  registerLink: {
    color: '#F5C20A',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10,
    paddingLeft: 18,
  },
});

export default LoginScreen;
