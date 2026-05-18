import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig'; // Import firestore and auth from firebaseConfig
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      // Handle incomplete form fields error
      Alert.alert('Incomplete Form', 'Please fill in all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      // Handle password mismatch error
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
  
    try {
      // Create user with email and password using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Add user data to Firestore collection
      await setDoc(doc(firestore, 'users', user.uid), {
        // Use user.uid as the document ID
        username,
        email,
        password
        // Do not include the password field in Firestore
      });
  
      console.log('User registered successfully:', user.uid);
  
      // Navigate to login screen
      goToLogin();
    } catch (error) {
      console.error('Error registering user: ', error);
      // Display general error message
      Alert.alert('Registration Failed', 'An error occurred while registering. Please try again later.');
    }
  };


  return (
    <ImageBackground
      source={{
        uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/signup-mob-bg.jpg?v=1710057841605',
      }}
      style={styles.background}>
      <View style={styles.signupPage}>
        <Text style={styles.head}>S I G N  U P</Text>

        <View style={styles.signupForm}>
          <View style={styles.inputGroup}>
            <Feather name="user" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#000000b6"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="mail" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#000000b6"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="lock" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#000000b6"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Feather name="lock" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#000000b6"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <LinearGradient
              colors={['#5adfe5', '#ec0d64']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientBackground, styles.buttonWidth]}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginLink}>
            Have an account already?{' '}
            <Text style={styles.loginLinkText}>Login Here!</Text>
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
  signupPage: {

    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 20, 36, 0.8)',
    padding: 40,
  },
  head: {
    textAlign: 'left',
    color: '#ffffff',
    fontSize: 20,
    paddingBottom: 12,
  },
  signupForm: {
    width: '100%',
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 9,
  },

  inputGroupRow1: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    marginRight: 12,
    borderRadius: 9,
  },

  inputGroupRow2: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 9,
  },

  iconRow: {
    marginHorizontal: 6,
    paddingLeft: 9,
  },


  inputRow: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    fontWeight: '800',
    height: 54,
    color: '#000000',
  },

  input: {
    flex: 1,
    paddingLeft: 0,
    padding: 18,
    color: '#000000',
  },

  signupButton: {
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
  signupButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 12,
    textAlign: 'center',
    color: '#d8caca',
  },
  loginLinkText: {

    color: '#F5C20A',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10,
    paddingLeft: 18,
  },
});

export default SignUpScreen;