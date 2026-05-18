import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../Header';
import { auth, firestore } from './../../firebaseConfig'

import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AwardsScreen = ({ navigation }) => {
  const [level, setLevel] = useState(0);
  const [userId, setUserId] = useState('');
  const [nutritionNinja, setNutritionNinja] = useState(0);
  const [hydroHustler, setHydroHustler] = useState(0);
  const [strengthSentinel, setStrengthSentinel] = useState(0);
  const [fitnessTrailblazer, setFitnessTrailblazer] = useState(0); 
  const [coins, setCoins] = useState(0);

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
        const taskData = taskDocSnapshot.data();
        setLevel(taskData.level || 0);
        setNutritionNinja(taskData.nutritionNinja || 0);
        setHydroHustler(taskData.hydroHustler || 0);
        setStrengthSentinel(taskData.strengthSentinel || 0);
        setFitnessTrailblazer(taskData.fitnessTrailblazer || 0);
      } else {
        // If the document doesn't exist, create it with level set to 1
        await setDoc(taskDocRef, { 
          level: 1, 
          nutritionNinja: 0, 
          hydroHustler: 0, 
          strengthSentinel: 0, 
          fitnessTrailblazer: 0,
          coins: 0,
        });
        setLevel(1);
        // Set other fields to their default values or 0
        setNutritionNinja(0);
        setHydroHustler(0);
        setStrengthSentinel(0);
        setFitnessTrailblazer(0);
        setCoins(0);
      }
    } catch (error) {
      console.error('Error fetching level:', error);
      return 0;
    }
  };
  
  

  useEffect(() => {
    fetchLevel();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.leftText}>LVL {level}</Text>
          <View style={styles.levelBarContainer}>
            <View style={[styles.levelBarFill, { width: `${level}%` }]} />
          </View>
        </View>
          <TouchableOpacity onPress={() => navigation.navigate('LeaderboardsScreen')}>
            <Image
              source={{ uri: 'https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/LEADERBOARD.png?v=1712895021065' }} // Replace with your image URL
              style={styles.leaderboard}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#101424', // Background color for Home Screen
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 25,
    paddingBottom: 10,
    width: "80%",
    alignItems: "center"
  },
  left: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  leftText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    bottom: 20,
    left: 0
  },
  levelBar: {
    width: 150,
    height: 150
  },
  levelBarContainer: {
    width: 150,
    height: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
    marginTop: 40,
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#5CE1E6', // Color for the filled portion of the level bar
  },
  
  leaderboard: {
    width: 100,
    height: 80
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 100,
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

export default AwardsScreen;
