import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 

import ErrorBoundary from './ErrorBoundary';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPassword from './screens/ForgotPassword';
import HomeTabNavigator from './screens/HomeTabNavigator';
import SignUpScreen from './screens/SignUpScreen';
import Profile from './screens/Profile';
import Community from './screens/tabs/Community';
import WaterTrackerScreen from './screens/tabs/tasks/WaterTracker';
import ExerciseScreen from './screens/tabs/tasks/Exercise';
import CompleteWaterIntake from './screens/tabs/tasks/CompleteWaterIntake';
import BreakfastLogScreen from './screens/confirmLogs/BreakfastLogScreen';
import LunchLogScreen from './screens/confirmLogs/LunchLogScreen';
import DinnerLogScreen from './screens/confirmLogs/DinnerLogScreen';
import LeaderboardsScreen from './screens/LeaderboardsScreen';
import Settings from './screens/Settings';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import EditAvatar from './screens/EditAvatar';

const firebaseConfig = {
  apiKey: "AIzaSyBgBeouFvKmEShlE2fG7sR9civqH63Uyw4",
  authDomain: "healthquest-16bec.firebaseapp.com",
  databaseURL: "https://healthquest-16bec-default-rtdb.firebaseio.com",
  projectId: "healthquest-16bec",
  storageBucket: "healthquest-16bec.appspot.com",
  messagingSenderId: "446788055678",
  appId: "1:446788055678:web:6686c67436b981753a5e2f"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('Firebase initialized successfully!');

const Stack = createStackNavigator();

export default function App() {
  const [splash, setSplash] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 3000); 
  }, []);


  return (
    <ErrorBoundary>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {splash ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="HomeTabNavigator" component={HomeTabNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Community" component={Community} />
            <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="CompleteWaterIntake" component= {CompleteWaterIntake} />
            <Stack.Screen name="BreakfastLogScreen" component= {BreakfastLogScreen} />
            <Stack.Screen name="LunchLogScreen" component= {LunchLogScreen} />
            <Stack.Screen name="DinnerLogScreen" component= {DinnerLogScreen} />
            <Stack.Screen name="LeaderboardsScreen" component= {LeaderboardsScreen} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="EditAvatar" component={EditAvatar} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
      </ErrorBoundary>
  );
}
