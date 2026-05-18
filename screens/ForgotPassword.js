import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import sendPasswordResetEmail method
import { auth } from '../firebaseConfig'; // Import Firebase auth instance
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    sendPasswordResetEmail(auth, email) // Using the imported method and auth instance
      .then(() => {
        Alert.alert('Success', 'Password reset email sent successfully');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter your email here</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#d3d3d3" 
        placeholder="example@gmail.com"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
           <LinearGradient
        colors={['#5adfe5', '#ec0d64']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientBackground, styles.buttonWidth]}
      >
        <TouchableOpacity onPress={handleResetPassword} style={styles.customButton}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#101424",
    padding: 30,
    gap: 20
  },
  heading: {
    color: "#5CE1E6",
    fontFamily: "Poppins-Regular",
    letterSpacing: 2,
    fontWeight: "900",
    fontSize: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    color: '#fff', // Set input text color to white
  },
  gradientBackground: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  buttonWidth: {
    width: '80%', // Adjust the width of the button
  },
  customButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;