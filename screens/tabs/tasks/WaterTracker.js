import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const WaterTrackerScreen = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [userId, setUserId] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('User is not logged in.');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchWaterIntake = async () => {
      if (userId) {
        try {
          const db = getFirestore();
          const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
          const userDocRef = doc(db, 'tasks', userId);
          const waterIntakeDocRef = doc(collection(userDocRef, dateToday), 'waterIntake');
  
          const docSnap = await getDoc(waterIntakeDocRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setWaterIntake(data.numGlasses);
          }
        } catch (error) {
          console.error('Error fetching Firestore data:', error);
        }
      }
    };
  
    fetchWaterIntake();
  }, [userId]);
  

  useEffect(() => {
    const now = new Date();
    
    setCurrentDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

    // Save current date and time as last opened date and time
    AsyncStorage.setItem('lastOpenedDate', currentDate);
    AsyncStorage.setItem('lastOpenedTime', currentTime);
  }, []);

  useEffect(() => {
    const fetchLastUpdateTime = async () => {
      try {
        const lastUpdateTime = await AsyncStorage.getItem('lastUpdateTime');
        setLastUpdateTime(lastUpdateTime || "");
      } catch (error) {
        console.error('Error fetching last update time from AsyncStorage:', error);
      }
    };

    fetchLastUpdateTime();
  }, []);

  const saveWaterIntake = async (intake) => {
    try {
      await AsyncStorage.setItem('waterIntake', intake.toString());
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setLastUpdateTime(formattedTime);
      await AsyncStorage.setItem('lastUpdateTime', formattedTime);
      
      if (userId) {
        const db = getFirestore();
        const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const userDocRef = doc(db, 'tasks', userId);
        const waterIntakeDocRef = doc(collection(userDocRef, dateToday), 'waterIntake');
        await setDoc(waterIntakeDocRef, { numGlasses: intake });
        await updateWaterExp(userId, intake); // Call updateWaterExp
      }
    } catch (error) {
      console.error('Error saving water intake to AsyncStorage and Firestore:', error);
    }
  };

  const updateWaterExp = async (userId, intake) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'tasks', userId); // Reference to the user's document
      const taskDocSnapshot = await getDoc(userDocRef);
  
      if (taskDocSnapshot.exists()) {
        const taskData = taskDocSnapshot.data(); 
        let updatedExp = (taskData.hydroHustler || 0) + (intake * 10);
  
        updatedExp = Math.min(updatedExp, 80);
        if (intake < taskData.numGlasses) {
          const decreaseAmount = (taskData.numGlasses - intake) * 10;
          updatedExp -= decreaseAmount;
          updatedExp = Math.max(updatedExp, 0);
        }
  
        await updateDoc(userDocRef, { hydroHustler: updatedExp });
      } else {
        await setDoc(userDocRef, { hydroHustler: intake * 10 });
      }
    } catch (error) {
      console.error('Error updating water experience in Firestore:', error);
    }
  };
  
  const incrementWaterIntake = async () => {
    if (waterIntake < 8) {
      const newIntake = waterIntake + 1;
      setWaterIntake(newIntake);
      saveWaterIntake(newIntake);
    }
  };

  const decrementWaterIntake = async () => {
    if (waterIntake > 0) {
      const newIntake = waterIntake - 1;
      setWaterIntake(newIntake);
      saveWaterIntake(newIntake);
    }
  };

  const handleTaskFinished = () => {
    navigation.navigate('CompleteWaterIntake');
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.title, { color: '#fff' }]}>Today's Water Intake</Text>
      <View style={styles.dateTimeContainer}>
        <Text style={[styles.currentDateTime, { color: '#fff' }]}>
          {currentDate}
        </Text>
        <Text style={[styles.currentTime, { color: '#fff' }]}>
          {currentTime}
        </Text>
      </View>
      <View style={styles.lastOpenedDateTimeContainer}>
        <Text style={[styles.lastOpenedDateTimeLabel, { color: '#fff' }]}>
          Last Update:
        </Text>
        <Text style={[styles.lastOpenedDateTime, { color: '#fff' }]}>
          {lastUpdateTime}
        </Text>
      </View>

      <View style={styles.glassContainer}>
        <View style={[styles.glass, { height: `${(waterIntake / 8) * 100}%` }]} />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={decrementWaterIntake}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.waterIntake, { color: '#fff' }]}>{waterIntake} / 8</Text>
        <TouchableOpacity style={styles.button} onPress={incrementWaterIntake}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>+</Text>
        </TouchableOpacity>
      </View>
      {waterIntake >= 8 && (
        <TouchableOpacity style={styles.taskFinishedButton} onPress={handleTaskFinished}>
          <Text style={styles.taskFinishedText}>Task Finished!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212740', // Black background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 1 ,
    fontFamily: 'Poppins-Regular',
  },
  dateTimeContainer: {
    flexDirection: 'row',
  },
  currentDateTime: {
    fontSize: 15,
    marginRight: 5,
    fontFamily: 'Poppins-Regular',
  },
  currentTime: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  lastOpenedDateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  lastOpenedDateTimeLabel: {
    fontSize: 10,
    marginRight: 5,
    fontFamily: 'Poppins-Regular',
  },
  lastOpenedDateTime: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  glassContainer: {
    width: 120,
    height: 240,
    overflow: 'hidden',
    marginBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#00bfff', // Outline color
    borderWidth: 2, // Outline width
    transform: [{ perspective: 400 }, { rotateX: '-40deg' }],
  },
  glass: {
    backgroundColor: '#00bfff',
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    transform: [{ scaleY: 0.8 }],
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 15,
    marginHorizontal: 30,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  waterIntake: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  taskFinishedButton: {
    marginTop: 20,
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  taskFinishedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WaterTrackerScreen;
