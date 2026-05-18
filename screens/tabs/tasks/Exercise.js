import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ExerciseScreen = () => {
  const [userId, setUserId] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(false);
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
    const fetchExercise = async () => {
      if (userId) {
        try {
          const db = getFirestore();
          const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
          const userDocRef = doc(db, 'tasks', userId);
          const ExerciseDocRef = doc(collection(userDocRef, dateToday), 'exercise');
  
          const docSnap = await getDoc(ExerciseDocRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTimer(data.timeLeft); // Corrected from setExercise to setTimer
          }
        } catch (error) {
          console.error('Error fetching Firestore data:', error);
        }
      }
    };
  
    fetchExercise();
  }, [userId]);
  

  useEffect(() => {
    let interval;
    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          updateExerciseTime(prevTimer); // Update exercise time in Firestore
          return prevTimer - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      congratulateUser();
    }
  
    return () => clearInterval(interval);
  }, [timerRunning, timer]);
  
  const updateExerciseTime = async (timeLeft) => {
    if (userId) {
      try {
        const db = getFirestore();
        const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
        const userDocRef = doc(db, 'tasks', userId);
        const exerciseDocRef = doc(collection(userDocRef, dateToday), 'exercise');
  
        const docSnap = await getDoc(exerciseDocRef);
  
        if (docSnap.exists()) {
          await updateDoc(exerciseDocRef, { timeLeft });
          await updateExerciseExp(userId, timeLeft); // Pass timeLeft as a parameter
        } else {
          await setDoc(exerciseDocRef, { timeLeft }); // Corrected to setDoc
          await updateExerciseExp(userId, timeLeft); // Pass timeLeft as a parameter
        }
      } catch (error) {
        console.error('Error updating Firestore data:', error);
      }
    }
  };

  const updateExerciseExp = async (userId, timeLeft) => { // Update the function signature to include timeLeft
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'tasks', userId); // Reference to the user's document
      const taskDocSnapshot = await getDoc(userDocRef);
  
      if (taskDocSnapshot.exists()) {
        const updatedExp = (timeLeft === 1) ? 100 : 0; // Set fitnessTrailblazer to 100 if timeLeft equals 1, otherwise keep it unchanged
  
        await updateDoc(userDocRef, { fitnessTrailblazer: updatedExp });
      } else {
        await setDoc(userDocRef, { fitnessTrailblazer: timeLeft * 10 });
      }
    } catch (error) {
      console.error('Error updating water experience in Firestore:', error);
    }
  };
  
  const congratulateUser = () => {
    // Add your congratulatory message logic here
    alert('Congratulations!! Exercise completed!');
    nextExercise();
  };

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimer(600); // Reset timer to 10 minutes
    setTimerRunning(false);
  };

  const nextExercise = () => {
    // Move to the next exercise or navigate back to home if all exercises are completed
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((prevIndex) => prevIndex + 1);
    } else {
      setExerciseIndex(0); // Reset to the first exercise
    }
  };
  
  

  const exercises = [
    { name: 'Squat', image: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/squat.gif?v=1712897356678' },
    { name: 'Jumping Jacks', image: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/jumping%20jacks.gif?v=1712897341739' },
    { name: 'Plank', image: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/plank.gif?v=1712897344235' },
    { name: 'Reverse Lunge', image: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/reverse%20lunge.gif?v=1712897346491' },
    { name: 'Push Up', image: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/push%20up.gif?v=1712897348171' },
  ];

  const currentExercise = exercises[exerciseIndex];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const progressBarWidth = (timer / 600) * 100; // Calculate width of progress bar

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.title, { color: '#fff' }]}>Daily Exercise Task</Text> 
      <View style={styles.exerciseContainer}>
        <Image source={{ uri: currentExercise.image }} style={styles.exerciseImage} />
        <Text style={[styles.exerciseName, { color: '#fff' }]}>
          {currentExercise.name}
        </Text>
      </View>
      <View style={styles.timerContainer}>
        <View style={[styles.progress, { width: `${progressBarWidth}%` }]}></View>
        <Text style={[styles.timerText, { color: '#fff' }]}>
          {formatTime(timer)}
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startTimer}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={stopTimer}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Pause</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetTimer}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={nextExercise}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  exerciseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%', // Make sure the progress bar spans the entire width
  },
  progress: {
    height: 10,
    backgroundColor: '#00FF00', // Green color for progress bar
    position: 'absolute',
    top: 0,
    left: 0,
  },
  timerText: {
    fontSize: 30,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  buttonsContainer: {
    flexDirection: 'column', // Changed to column for button rows
    alignItems: 'center',
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%', // Make sure button row spans the entire width
  },
  button: {
    flex: 1, // Make buttons within a row share equal space
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#00bfff', // Blue color for Start button
  },
  pauseButton: {
    backgroundColor: '#ff4500', // Orange color for Pause button
  },
  resetButton: {
    backgroundColor: '#ffd700', // Yellow color for Reset button
  },
  skipButton: {
    backgroundColor: '#8a2be2', // BlueViolet color for Skip button
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
});

export default ExerciseScreen;
