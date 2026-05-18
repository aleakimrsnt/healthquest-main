import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore} from '../firebaseConfig'; // Import auth and firestore
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Import firestore methods
import { LinearGradient } from 'expo-linear-gradient';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'; // Import reauthenticateWithCredential and EmailAuthProvider
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';


const Settings = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [disableInputs, setDisableInputs] = useState(true); // State variable to manage input disablement

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const userQuery = query(collection(firestore, 'users'), where('email', '==', userEmail));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUsername(userData.username || ''); 
            setEmail(userEmail || ''); 
            setPassword(userData.password || ''); 
            if (userData.profilePic) {
              setProfilePic(userData.profilePic); 
            } else {
              setProfilePic('https://cdn.hero.page/pfp/894422f2-35d0-4fcc-a83b-c0ba647da537-monochrome-aesthetic-anime-boy-pfp-aesthetic-overview-3.png'); 
            }
          } else {
            setProfilePic('Unknown');
          }
        }
      } catch (error) {
        setError('Error fetching user');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); 

   
    return () => setProfilePic('');
  }, []);

  const handleBack = () => {
    navigation.goBack(); 
  };

  const handleImageUpload = async () => {
    try {
      const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!imagePickerResult.cancelled) {
        const uri = imagePickerResult.uri;
        setProfilePic(uri); // Set the selected image URI to the profilePic state
      }
    } catch (error) {
      console.error('Error picking image:', error);
      // Handle error, if any
    }
  };
  

  const handleSaveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Check if the entered current password matches the user's current password
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
  
        // If reauthentication is successful, upload profile picture to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `profilePics/${currentUser.uid}`);
        const response = await fetch(profilePic);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
  
        // Update the user data in the Firestore database with the profile picture URL
        const userRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(userRef, {
          username: username,
          email: email,
          // Only update the password if a new password is provided
          password: newPassword || password,
          profilePic: `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/profilePics%2F${currentUser.uid}?alt=media`
        });
  
        // Clear password fields
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
  
        Alert.alert('Success', 'Profile updated successfully!');
        setEditingProfile(false); // Disable editing mode after saving changes
        setDisableInputs(true); // Disable input fields
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'The current password you entered is incorrect. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again later.');
      }
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.editProfileText}>Edit Profile</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <View>
              <LinearGradient
                colors={['#8C52FF', '#FF914D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientBackground, styles.profilePicContainer]}>
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
                {editingProfile && (
                <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload}>
                <MaterialIcons name="edit" size={30} color={"#8C52FF"} />
              </TouchableOpacity>
              )}
                
                {!editingProfile && (
                  <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditingProfile(true)}>
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
              <View style={styles.userInfo}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={[styles.input, !editingProfile && styles.disabledInput, !editingProfile && { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="Enter your username"
                  editable={editingProfile || !disableInputs} // Enable input only when editingProfile is true or disableInputs is false
                />
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, !editingProfile && styles.disabledInput, !editingProfile && { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  editable={editingProfile || !disableInputs} // Enable input only when editingProfile is true or disableInputs is false
                />
                {!editingProfile && password && (
                  <>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                      value={password}
                      placeholder="Enter your password"
                      secureTextEntry
                      editable={false} // Make the password field non-editable
                    />
                  </>
                )}
                {editingProfile && (
                  <>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                      style={styles.input}
                      
                      onChangeText={(text) => setPassword(text)}
                      placeholder="Enter your current password"
                      secureTextEntry
                    />
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={(text) => setNewPassword(text)}
                      placeholder="Enter your new password"
                      secureTextEntry
                    />
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(text)}
                      placeholder="Confirm your new password"
                      secureTextEntry
                    />
                  </>
                )}
              </View>


              {editingProfile && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#212740',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: 1,
  },
  editProfileText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 50,
  },
  profilePicContainer: {
    alignItems: 'center',
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginVertical: 20,
    marginTop: 40,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    letterSpacing: 3,
  },
  input: {
    width: 270,
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginTop: 5,
    fontSize: 14,
    letterSpacing: 3,
    borderColor: 'rgba(140, 82, 255, 0.7)', // Add border color here
    borderWidth: 2,
    
  },
  gradientBackground:{
    width:400,
    paddingBottom: 20,
    marginTop: 30,
  },
  userInfo:{
    paddingHorizontal: 65,
    marginTop:20,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems:'center',
    marginTop: 10,
  },
  editProfileButtonText: {
    color: '#212740',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#8C52FF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    margin:40,
    alignItems:'center',
    marginTop: 20,
    marginBottom:10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',

  },
  disabledInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  editIcon:{
   marginTop: -45,
   marginLeft: 90,
  
  }
});

export default Settings;