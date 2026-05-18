import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import Header from "../Header";
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PlanScreen = ({ navigation, route }) => {
  const [breakfastFoods, setBreakfastFoods] = useState([]);
  const [lunchFoods, setLunchFoods] = useState([]);
  const [dinnerFoods, setDinnerFoods] = useState([]);
  const [breakfastCalories, setBreakfastCalories] = useState("");
  const [lunchCalories, setLunchCalories] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with current date
  const [timeLeft, setTimeLeft] = useState(0);
  const isFocused = useIsFocused();

  const fetchBreakfast = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) {
        const userId = user.uid;
        const db = getFirestore();
        const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const userDocRef = doc(db, 'foodIntake', userId);
        const breakfastDocRef = doc(collection(userDocRef, dateToday), 'Breakfast');
        const docSnap = await getDoc(breakfastDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.foods) {
            let totalCalories = 0;
            let breakfastFoods = [];
            data.foods.forEach(food => {
              totalCalories += food.calories || 0;
              breakfastFoods.push({
                name: food.name || "",
                grams: food.grams || 0
              });
            });
            // Round the total calories to the nearest whole number
            totalCalories = Math.round(totalCalories);
            setBreakfastCalories(totalCalories);
            setBreakfastFoods(breakfastFoods);
          } else {
            // If breakfast data doesn't exist or has no food items, reset the state
            setBreakfastCalories(0);
            setBreakfastFoods([]);
          }
        } else {
          // If breakfast data doesn't exist, reset the state
          setBreakfastCalories(0);
          setBreakfastFoods([]);
        }
      }
    } catch (error) {
      console.error('Error fetching breakfast:', error);
    }
  };

  const fetchLunch = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) {
        const userId = user.uid;
        const db = getFirestore();
        const dateString = currentDate.toDateString();
        const dateFormatted = new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });        const userDocRef = doc(db, 'foodIntake', userId);
        const lunchDocRef = doc(collection(userDocRef, dateFormatted), 'Lunch');
        const docSnap = await getDoc(lunchDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.foods) {
            let totalCalories = 0;
            let lunchFoods = [];
            data.foods.forEach(food => {
              totalCalories += food.calories || 0;
              lunchFoods.push({
                name: food.name || "",
                grams: food.grams || 0
              });
            });
            // Round the total calories to the nearest whole number
            totalCalories = Math.round(totalCalories);
            setLunchCalories(totalCalories);
            setLunchFoods(lunchFoods);
          } else {
            // If lunch data doesn't exist or has no food items, reset the state
            setLunchCalories(0);
            setLunchFoods([]);
          }
        } else {
          // If lunch data doesn't exist, reset the state
          setLunchCalories(0);
          setLunchFoods([]);
        }
      }
    } catch (error) {
      console.error('Error fetching lunch:', error);
    }
  };

  const fetchDinner = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) {
        const userId = user.uid;
        const db = getFirestore();
        const dateString = currentDate.toDateString();
        const dateFormatted = new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });        const userDocRef = doc(db, 'foodIntake', userId);
        const dinnerDocRef = doc(collection(userDocRef, dateFormatted), 'Dinner');
        const docSnap = await getDoc(dinnerDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.foods) {
            let totalCalories = 0;
            let dinnerFoods = [];
            data.foods.forEach(food => {
              totalCalories += food.calories || 0;
              dinnerFoods.push({
                name: food.name || "",
                grams: food.grams || 0
              });
            });
            // Round the total calories to the nearest whole number
            totalCalories = Math.round(totalCalories);
            setDinnerCalories(totalCalories);
            setDinnerFoods(dinnerFoods);
          } else {
            // If dinner data doesn't exist or has no food items, reset the state
            setDinnerCalories(0);
            setDinnerFoods([]);
          }
        } else {
          // If dinner data doesn't exist, reset the state
          setDinnerCalories(0);
          setDinnerFoods([]);
        }
      }
    } catch (error) {
      console.error('Error fetching dinner:', error);
    }
  };

  const fetchTimeLeft = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) { // Check if the screen is focused before fetching data
        const userId = user.uid;

        const db = getFirestore();
        const currentDate = new Date();
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateToday = currentDate.toLocaleDateString('en-US', dateOptions);

        const docRef = doc(db, 'tasks', userId, dateToday, 'exercise'); // Assuming the document structure is similar to the water intake example
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.timeLeft) {
            setTimeLeft(data.timeLeft);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching timeLeft:', error);
    }
  };

  useEffect(() => {
    fetchBreakfast(); // Initial data fetch when component mounts
    fetchLunch();
    fetchDinner();
    fetchTimeLeft();
  }, [isFocused]); // Add isFocused to the dependency array

  // Reload data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBreakfast(); // Initial data fetch when component mounts
      fetchLunch();
      fetchDinner();
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Empty dependency array to run only once, effectively reloading the screen

  const totalExercise = Math.ceil((600 - timeLeft) / 60 * 10);
  const totalFoodCalories = breakfastCalories + lunchCalories + dinnerCalories;
  const remainingCalories = Math.ceil(1200 - (totalFoodCalories - 100));  

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.content}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
          </View>
          <View style={styles.goalContainer}>
            <View style={styles.column}>
              <Text style={styles.columnText}>1200</Text>
              <Text style={styles.columnSubText}>GOAL</Text>
            </View>
            <Text style={styles.operator}>-</Text>
            <Text style={styles.parenthesis}>(</Text>
            <View style={styles.column}>
              <Text style={styles.columnText}>{totalFoodCalories}</Text>
              <Text style={styles.columnSubText}>FOOD</Text>
            </View>
            <Text style={styles.operator}>-</Text>
            <View style={styles.column}>
              <Text style={styles.columnText}>{totalExercise}</Text>
              <Text style={styles.columnSubText}>EXERCISE</Text>
            </View>
            <Text style={styles.parenthesis}>)</Text>
            <Text style={styles.operator}>=</Text>
            <View style={styles.column}>
              <Text style={styles.columnTextSpecial}>
                {remainingCalories}
              </Text>
              <Text style={styles.columnSubTextSpecial}>REMAINING</Text>
            </View>

          </View>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>BREAKFAST</Text>
            <Text style={styles.mealCalories}>{breakfastCalories} CAL</Text>
          </View>
          <View style={styles.foodList}>
            {breakfastFoods.map((food, index) => (
              <View key={index} style={styles.foodListItem}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodGrams}>{food.grams}g</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("BreakfastLogScreen")}
          >
            <Text style={styles.addFood}>+ Add Food</Text>
          </TouchableOpacity>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>LUNCH</Text>
            <Text style={styles.mealCalories}>{lunchCalories} CAL</Text>
          </View>
          <View style={styles.foodList}>
            {lunchFoods.map((food, index) => (
              <View key={index} style={styles.foodListItem}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodGrams}>{food.grams}g</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("LunchLogScreen")}
          >
            <Text style={styles.addFood}>+ Add Food</Text>
          </TouchableOpacity>
          <View style={styles.mealRow}>
            <Text style={styles.mealText}>DINNER</Text>
            <Text style={styles.mealCalories}>{dinnerCalories} CAL</Text>
          </View>
          <View style={styles.foodList}>
            {dinnerFoods.map((food, index) => (
              <View key={index} style={styles.foodListItem}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodGrams}>{food.grams}g</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("DinnerLogScreen")}
          >
            <Text style={styles.addFood}>+ Add Food</Text>
          </TouchableOpacity>
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#101424", // Background color for Home Screen
    paddingBottom: 120,
  },
  content: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 25,
    alignItems: "center",
  },
  arrow: {
    height: 30,
    width: 30,
  },
  dateText: {
    color: "#5CE1E6",
    fontFamily: "Poppins-Regular",
    letterSpacing: 6,
    fontWeight: "900",
    fontSize: 25,
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 6,
  },
  operator: {
    color: "#ffffff",
    textAlign: "center",
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "900",
  },
  parenthesis: {
    color: "#ffffff",
    textAlign: "center",
    alignSelf: "flex-start",
    fontSize: 30,
    fontWeight: "500",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  columnText: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontWeight: "900",
  },
  columnSubText: {
    color: "#5CE1E6",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "900",
    fontSize: 12,
  },
  columnTextSpecial: {
    color: "#69AD3A",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "900",
    fontSize: 16,
  },
  columnSubTextSpecial: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "900",
    fontSize: 12,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#212740",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mealText: {
    color: "#ffffff",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    fontWeight: "900",
  },
  mealCalories: {
    color: "#ffffff",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    fontWeight: "900",
  },
  foodList: {
    width: "100%",
  },
  foodListItem: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
  },
  foodName: {
    color: "#ffffff",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  foodGrams: {
    color: "#ffffff",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  addFood: {
    color: "#5CE1E6",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontStyle: 'italic',
    fontWeight: "bold",
    fontSize: 15,
    maxWidth: 150,
  },
});

export default PlanScreen;
