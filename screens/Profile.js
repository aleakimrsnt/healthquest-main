import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, getDoc, updateDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'; // Add onSnapshot
import { auth, firestore } from '../firebaseConfig'; // Import auth and firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions

const Profile = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [level, setLevel] = useState(0);
  const [userId, setUserId] = useState('');
  const [nutritionNinja, setNutritionNinja] = useState('');
  const [hydroHustler, setHydroHustler] = useState('');
  const [strengthSentinel, setStrengthSentinel] = useState('');
  const [fitnessTrailblazer, setFitnessTrailblazer] = useState(''); 

  useEffect(() => {
    // Function to reset the values
    const resetValues = () => {
      setNutritionNinja(0);
      setHydroHustler(0);
      setStrengthSentinel(0);
      setFitnessTrailblazer(0);
    };
  
    // Calculate the milliseconds remaining until the next midnight
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // Set time to midnight
    const timeUntilMidnight = nextMidnight - now;
  
    // Schedule the reset for midnight
    const timer = setTimeout(() => {
      resetValues();
    }, timeUntilMidnight);
  
    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [nutritionNinja, hydroHustler, strengthSentinel, fitnessTrailblazer]); // Dependency array ensures this effect runs only when these values change
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid); // Update userId with the UID of the logged-in user
        await fetchLevel(user.uid); // Fetch the level using the UID
      } else {
        console.log('User is not logged in.');
      }
    });
  
    return unsubscribe;
  }, []);

  const fetchLevel = async (userId) => {
    try {
      const taskDocRef = doc(firestore, 'tasks', userId);
      const taskDocSnapshot = await getDoc(taskDocRef);
  
      if (taskDocSnapshot.exists()) {
        const taskData = taskDocSnapshot.data(); // Return level if exists, otherwise default to 0
        setLevel(taskData.level || 0);
        setNutritionNinja(taskData.nutritionNinja || 0);
        setHydroHustler(taskData.hydroHustler || 0);
        setStrengthSentinel(taskData.strengthSentinel || 0);
        setFitnessTrailblazer(taskData.fitnessTrailblazer || 0);
      } else {
        return 0; // Return default level if task document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching level:', error);
      return 0; // Return default level value in case of error
    }
  };
  

  useEffect(() => {
    fetchLevel();
  }, []);

  useEffect(() => {
    // Fetch username from Firestore when the component mounts
    const fetchUsername = async () => {
      try {
        const users = auth.currentUser;
        if (users) {
          // Extract username from email address
          const email = users.email;
          const atIndex = email.indexOf('@');
          const usernameFromEmail = email.substring(0, atIndex);
  
          setUsername(usernameFromEmail);
        } else {
          setError('No user is currently authenticated.');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setError('Error fetching username: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsername();

    const fetchProfilePic = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const userQuery = query(collection(firestore, 'users'), where('email', '==', userEmail));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData.profilePic) {
              // If profilePic exists, set it
              setProfilePic(userData.profilePic);
            } else {
              // If profilePic doesn't exist, set the default profile picture URL
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

    fetchProfilePic();

  
    // Add listener for changes to the user document in Firestore
    const unsubscribe = onSnapshot(doc(firestore, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData && userData.username) { // Add check for userData existence
          setUsername(userData.username);
        }
      }
    });
  
    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
      setUsername(''); // Reset the username state
    };
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
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(getStorage(), `profilePics/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
  
        // Check if the profilePic state is empty
        if (!profilePic) {
          // Set the profilePic state to the default profile picture URL
          setProfilePic('https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/logo.png?v=1712489917428');
        } else {
          // Update the user document in Firestore with the new profile picture URL
          await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
            profilePic: url,
          });
  
          setProfilePic(url);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image: ' + error.message);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.replace('LoginScreen'); // Navigate to the Login screen after logout
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out: ' + error.message);
    }
  };

  const profileDetails = {
    username: username,
    level: 5,
    profilePicture: profilePic, // URL of the profile picture
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{username}'s Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#8C52FF', '#FF914D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientBackground, styles.buttonWidth]}>
          <View style={styles.profileContainer}>
            <View style={styles.userInfo}>
              {/* Profile Picture */}
              <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('EditAvatar')}>                
              <Image
                  style={[styles.profilePicture, { borderRadius: 45 }]}
                  source={{ uri: profileDetails.profilePicture }}
                />
              </TouchableOpacity>

              <View style={styles.userInfoDetails}>
                <Text style={styles.username}>
                  {loading ? 'Loading...' : error ? error : username}
                  <Text style={styles.status}>•</Text>
                </Text>
                <Text style={styles.level}>Level: {level}</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Latest Achievements</Text>
          <View style={styles.row}>
            <Image
              source={{
                uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(3).png?v=1710749069613',
              }}
              style={styles.img}
            />
            <Text style={styles.achievementText}>
              Nutrition Ninja
              <Text style={styles.achievementSubText}>
                {'\n'}Achieved 1 hour ago.
              </Text>
            </Text>
          </View>

          <View style={styles.row}>
            <Image
              source={{
                uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(2).png?v=1710748932072',
              }}
              style={styles.img}
            />
            <Text style={styles.achievementText}>
              Hydro Hustler
              <Text style={styles.achievementSubText}>
                {'\n'}Achieved 7 hours ago.
              </Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.rectangle}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(3).png?v=1710749069613' }} // Replace with your image URL
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Nutrition Ninja</Text>
              <Text style={styles.description}>
                Slice through your health goals by consuming a colorful array of fruits and veggies for 100 days, proving your mastery of balanced nutrition!
              </Text>
            </View>
            <Text style={styles.absolutered}>{nutritionNinja}/100</Text>
          </View>

          <View style={styles.rectangle}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(2).png?v=1710748932072' }} // Replace with your image URL
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Hydro Hustler</Text>
              <Text style={styles.description}>
                Save the day and your health by drinking 8 glasses of water daily for 100 days straight, proving yourself as the hustler of hydration!
              </Text>
            </View>
            <Text style={styles.absolutegreen}>{hydroHustler}/80</Text>
          </View>

          <View style={styles.rectangle}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(6).png?v=1710750321560' }} // Replace with your image URL
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Strength Sentinel</Text>
              <Text style={styles.description}>
                Guard your gains and fortify your body by consistently consuming enough protein for 100 days, proving yourself as a vigilant sentinel of strength and vitality!
              </Text>
            </View>
            <Text style={styles.absolutered}>{strengthSentinel}/100</Text>
          </View>

          <View style={styles.rectangle}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/Untitled%20design%20(5).png?v=1710750267058' }} // Replace with your image URL
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Fitness Trailblazer</Text>
              <Text style={styles.description}>
                Blaze a trail to fitness success by reaching 1000 minutes of exercise, proving that your dedication to health knows no limits!
              </Text>
            </View>
            <Text style={styles.absolutegreen}>{fitnessTrailblazer}/100</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingTop: 0,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#191921',
    padding: 25,
    paddingTop:50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileContainer: {
    width: '100%',
  },
  gradientBackground: {
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    marginRight: 25,
    borderRadius: 50, // Remove quotes around 50
},
  userInfoDetails: {
    flex: 1,
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  status: {
    paddingLeft: 5,
    color: '#8AE234',
  },
  level: {
    fontSize: 16,
    color: '#ffffff',
    paddingTop: 3,
    paddingBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#31356E',
    paddingVertical: 5,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  achievementsContainer: {
    backgroundColor: '#212740',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  img: {
    height: 60,
    width: 60,
    marginLeft: 10,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'light',
    color: '#ffffff',
    flex: 1, // Ensure text takes up remaining space in row
    textAlign: 'left',
    paddingLeft: 25,
  },
  achievementSubText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'light',
    color: '#ffffff',
    textAlign: 'left',
    paddingTop: 0,
  },
  
  content: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    
    backgroundColor: '#31356E',
    width: '100%',
  },
  rectangle: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20, // Adjust the border radius as needed
    padding: 20,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 15, // Add margin between image and text
  },
  image: {
    width: 60, // Adjust width of the image
    height: 60, // Adjust height of the image
    borderRadius: 25, // Adjust border radius to make it circular
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  description: {
    fontSize: 9,
    color: '#ffffff',
    textAlign: 'center',
  },
  absolutered: {
    fontSize: 9,
    color: 'red',
    position: 'relative',
    marginLeft: 10,
  },
  absolutegreen: {
    fontSize: 9,
    color: 'green',
    marginLeft: 10,
    position: 'relative',
  },
});

export default Profile;