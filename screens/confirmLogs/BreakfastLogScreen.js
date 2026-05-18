import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import foodBank from '../banks/FoodBank';
import Header from '../Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BreakfastLogScreen = ({ navigation }) => {

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [fiber, setFiber] = useState("");
  const [fats, setFats] = useState("");
  const [otherNutrients, setOtherNutrients] = useState("");

  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [grams, setGrams] = useState("");
  const [nutritionData, setNutritionData] = useState({
    protein: 0,
    carbs: 0,
    fiber: 0,
    otherNutrients: 0,
    fats: 0,
  });

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
    const fetchBreakfast = async () => {
      if (userId) {
        try {
          const db = getFirestore();
          const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
          const userDocRef = doc(db, 'foodIntake', userId);
          const breakfastDocRef = doc(collection(userDocRef, dateToday), 'Breakfast');
  
          const docSnap = await getDoc(breakfastDocRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setGrams(data.grams || "");
            setProtein(data.protein || 0);
            setFiber(data.fiber || 0);
            setFats(data.fats || 0);
            setOtherNutrients(data.otherNutrients || 0);
  
            // Update foods state with the data fetched from Firestore
            setFoods(data.foods || []);
            // Update nutrition data based on the fetched foods
            updateNutritionData(data.foods || []);
          } else {
            // If the document doesn't exist, reset the state
            setName("");
            setGrams("");
            setProtein(0);
            setFiber(0);
            setFats(0);
            setOtherNutrients(0);
            // Reset foods and nutrition data
            setFoods([]);
            setNutritionData({
              protein: 0,
              carbs: 0,
              fiber: 0,
              otherNutrients: 0,
              fats: 0,
            });
          }
        } catch (error) {
          console.error('Error fetching Firestore data:', error);
        }
      }
    };
  
    fetchBreakfast();
  }, [userId]);
  
  

  const addFood = async () => {
    if (selectedFood && grams) {
      const foodToAdd = foodBank.find(food => food.name === selectedFood);
      const newFood = {
        name: foodToAdd.name,
        grams: parseInt(grams),
        calories: calculateCalories(parseInt(grams), foodToAdd.calories),
      };
      const updatedFoods = [...foods, newFood];
      setFoods(updatedFoods);
      updateNutritionData(updatedFoods);
      setSelectedFood("");
      setGrams("");
  
      try {
        if (userId) {
          const db = getFirestore();
          const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          const userDocRef = doc(db, 'foodIntake', userId);
          const breakfastDocRef = doc(collection(userDocRef, dateToday), 'Breakfast');
          const docSnap = await getDoc(breakfastDocRef);
  
          if (docSnap.exists()) {
            // If the document exists, update it
            await updateDoc(breakfastDocRef, {
              foods: [...updatedFoods],
              nutritionData: {
                protein: nutritionData.protein,
                fiber: nutritionData.fiber,
                fats: nutritionData.fats,
                otherNutrients: nutritionData.otherNutrients,
              }
            });
          } else {
            // If the document doesn't exist, create it
            await setDoc(breakfastDocRef, {
              foods: [...updatedFoods],
              nutritionData: {
                protein: nutritionData.protein,
                fiber: nutritionData.fiber,
                fats: nutritionData.fats,
                otherNutrients: nutritionData.otherNutrients,
              }
            });
          }
        }
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };
  

  const calculateCalories = (grams, caloriesPerGram) => {
    return grams * caloriesPerGram;
  };

  const updateNutritionData = (foods) => {
    let proteinTotal = 0;
    let fiberTotal = 0;
    let fatsTotal = 0;
    let otherNutrientsTotal = 0;

    foods.forEach((food) => {
      // Calculate nutrition based on food bank values
      const foodInfo = foodBank.find(item => item.name === food.name);
      proteinTotal += foodInfo.protein * (food.grams / 100);
      fiberTotal += foodInfo.fiber * (food.grams / 100);
      fatsTotal += foodInfo.fat * (food.grams / 100);
      otherNutrientsTotal += foodInfo.otherNutrients * (food.grams / 100);
    });

    setNutritionData({
      protein: proteinTotal,
      fiber: fiberTotal,
      fats: fatsTotal,
      otherNutrients: otherNutrientsTotal,
    });
  };

  const renderBar = (label, value, color) => {
    return (
      <View style={styles.barContainer}>
        <Text style={styles.barLabel}>{label}</Text>
        <View
          style={[styles.bar, { backgroundColor: color, width: `${value}%` }]} // Set background color using backgroundColor
        />
        <Text style={styles.barValue}>{value}</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Header navigation={navigation} />
        </ View>
      <View style={styles.content}>
        <Text style={styles.confirmLog}>Confirm Log</Text>
        <Text style={styles.time}>Breakfast</Text>
        <View style={styles.foodContainer}>
          <View style={styles.viewContainer}>
            <View style={styles.foodContent}>
              <Text style={styles.heading}>FOOD</Text>
              <Picker
                selectedValue={selectedFood}
                onValueChange={(itemValue, itemIndex) => setSelectedFood(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickeritem}
              >
                <Picker.Item label="Select Food" value="" style={{ fontSize: 15, }}/>
                {foodBank.map((food, index) => (
                  <Picker.Item key={index} label={food.name} value={food.name} style={{ fontSize: 15 }} />
                ))}
              </Picker>
              <Text style={styles.heading}>GRAMS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter grams"
                keyboardType="numeric"
                value={grams}
                onChangeText={(text) => setGrams(text)}
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addFood}
            >
              <Text style={styles.buttonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logList}>
            <FlatList
              data={foods}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemGrams}>{item.grams}g</Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionTitle}>Nutrition Summary</Text>
          <View style={styles.barChart}>
            {renderBar("Protein", nutritionData.protein, "#4CAF50")}
            {renderBar("Fiber", nutritionData.fiber, "#2196F3")}
            {renderBar("Fats", nutritionData.fats, "#FF5722")}
            {renderBar("Other Nutrients", nutritionData.otherNutrients, "#FFC107")}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    backgroundColor: "#101424",
  },
  centered: {
    
    alignItems: 'center',
  },
  content: {
    
    padding: 30,
    flex: 1,
    justifyContent: "space-between",
  },
  confirmLog: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: 'center',
  },
  
  time: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#5CE1E6",
    alignSelf: 'center',
  },
  foodContainer: {
    flex: 1,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  foodContent: {
    flex: 1,
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff"
  },
  picker: {
    height: 30,
    width: "90%",
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  pickerItem: {
    fontSize: 16,
    height: 30,
    color: '#000', // Customize the color of the picker items'
  },
  input: {
    height: 40,
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff"
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    alignSelf: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logList: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  itemName: {
    fontWeight: "bold",
    color: "#fff"
  },
  itemGrams: {
    color: "#666",
  },
  nutritionContainer: {
    
    backgroundColor: '#212740',
    marginTop: 20,
    padding: 20,
    borderRadius: 25,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff"
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  barLabel: {
    width: 100,
    color: "#fff"

  },
  bar: {
    height: 20,
    marginRight: 10,
    borderRadius: 5,
    color: "#fff"
  },
  barValue: {
    minWidth: 100,
    color: "#fff"
  },
});

export default BreakfastLogScreen;
